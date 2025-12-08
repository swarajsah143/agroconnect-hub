import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing crop image for disease detection...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert agricultural pathologist and plant disease specialist. Analyze crop images to identify diseases, pests, or nutrient deficiencies.

Your response MUST be a valid JSON object with this exact structure:
{
  "isHealthy": boolean,
  "diseaseName": string (disease name or "Healthy" if no disease),
  "confidence": number (0-100),
  "affectedPart": string (leaf, stem, fruit, root, or general),
  "cause": string (brief explanation of what causes this condition),
  "symptoms": string[] (list of visible symptoms),
  "prevention": string[] (list of prevention steps),
  "organicTreatment": string[] (organic remedies),
  "chemicalTreatment": string[] (chemical treatments with product names),
  "urgency": string ("low", "medium", "high", or "critical"),
  "additionalNotes": string (any other helpful information)
}

Be accurate and helpful. If you cannot identify the plant or see the image clearly, still provide the JSON with appropriate "unknown" values and lower confidence.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this crop image for any diseases, pests, or health issues. Provide a detailed diagnosis with treatment recommendations.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Service is busy. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('AI response received:', content?.substring(0, 200));

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No analysis result received' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON from the response
    let analysis;
    try {
      // Extract JSON from the response (might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a default structure if parsing fails
      analysis = {
        isHealthy: false,
        diseaseName: 'Analysis Inconclusive',
        confidence: 30,
        affectedPart: 'unknown',
        cause: 'Unable to determine from the provided image',
        symptoms: ['Image quality or angle may be insufficient for accurate diagnosis'],
        prevention: ['Ensure good lighting when taking photos', 'Capture close-up images of affected areas'],
        organicTreatment: ['Consult a local agricultural expert'],
        chemicalTreatment: ['Seek professional diagnosis before treatment'],
        urgency: 'low',
        additionalNotes: content
      };
    }

    console.log('Analysis complete:', analysis.diseaseName);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in analyze-crop-disease:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
