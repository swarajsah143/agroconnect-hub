import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Package, IndianRupee, Calendar, MapPin, Filter } from 'lucide-react';

// Mock sales data for last 2 years
const monthlySalesData = [
  { month: 'Jan 2023', sales: 45000, orders: 120 },
  { month: 'Feb 2023', sales: 52000, orders: 145 },
  { month: 'Mar 2023', sales: 48000, orders: 130 },
  { month: 'Apr 2023', sales: 61000, orders: 165 },
  { month: 'May 2023', sales: 55000, orders: 150 },
  { month: 'Jun 2023', sales: 67000, orders: 180 },
  { month: 'Jul 2023', sales: 72000, orders: 195 },
  { month: 'Aug 2023', sales: 69000, orders: 185 },
  { month: 'Sep 2023', sales: 58000, orders: 155 },
  { month: 'Oct 2023', sales: 63000, orders: 170 },
  { month: 'Nov 2023', sales: 71000, orders: 190 },
  { month: 'Dec 2023', sales: 78000, orders: 210 },
  { month: 'Jan 2024', sales: 52000, orders: 140 },
  { month: 'Feb 2024', sales: 58000, orders: 155 },
  { month: 'Mar 2024', sales: 55000, orders: 148 },
  { month: 'Apr 2024', sales: 68000, orders: 182 },
  { month: 'May 2024', sales: 62000, orders: 168 },
  { month: 'Jun 2024', sales: 75000, orders: 200 },
  { month: 'Jul 2024', sales: 82000, orders: 218 },
  { month: 'Aug 2024', sales: 79000, orders: 212 },
  { month: 'Sep 2024', sales: 65000, orders: 175 },
  { month: 'Oct 2024', sales: 72000, orders: 192 },
  { month: 'Nov 2024', sales: 85000, orders: 225 },
  { month: 'Dec 2024', sales: 92000, orders: 245 }
];

const seasonalData = [
  { season: 'Summer', sales: 285000, products: 'Mangoes, Watermelon, Cucumber', topProduct: 'Mangoes' },
  { season: 'Monsoon', sales: 320000, products: 'Rice, Corn, Leafy Vegetables', topProduct: 'Rice' },
  { season: 'Winter', sales: 380000, products: 'Wheat, Potatoes, Cauliflower', topProduct: 'Wheat' },
  { season: 'Post-Monsoon', sales: 260000, products: 'Pulses, Onions, Tomatoes', topProduct: 'Tomatoes' }
];

const topProductsData = [
  { name: 'Wheat', value: 25, color: 'hsl(var(--primary))' },
  { name: 'Rice', value: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Tomatoes', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Potatoes', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Mangoes', value: 10, color: 'hsl(var(--chart-5))' },
  { name: 'Others', value: 18, color: 'hsl(var(--muted))' }
];

const locationData = [
  { location: 'Punjab', sales: 450000 },
  { location: 'Maharashtra', sales: 380000 },
  { location: 'Karnataka', sales: 320000 },
  { location: 'Uttar Pradesh', sales: 290000 },
  { location: 'Haryana', sales: 250000 }
];

// Previous Year Market Analysis Data
const previousYearAnalysis = {
  yearOverYear: {
    revenue: { current: 839000, previous: 709000, change: 18.3 },
    orders: { current: 4155, previous: 3695, change: 12.4 },
    avgPrice: { current: 202, previous: 192, change: 5.2 }
  },
  marketTrends: [
    { 
      crop: 'Wheat', 
      priceChange: '+12%', 
      demand: 'High',
      insight: 'Strong demand due to export opportunities. Winter season saw peak prices.',
      previousYearPrice: 2100,
      currentPrice: 2350
    },
    { 
      crop: 'Rice', 
      priceChange: '+8%', 
      demand: 'Medium-High',
      insight: 'Monsoon season production was above average, prices stabilized post-harvest.',
      previousYearPrice: 2800,
      currentPrice: 3024
    },
    { 
      crop: 'Tomatoes', 
      priceChange: '-15%', 
      demand: 'Medium',
      insight: 'Oversupply in post-monsoon led to price drops. Consider cold storage.',
      previousYearPrice: 45,
      currentPrice: 38
    },
    { 
      crop: 'Mangoes', 
      priceChange: '+22%', 
      demand: 'Very High',
      insight: 'Premium varieties saw exceptional demand. Export quality fetched top prices.',
      previousYearPrice: 80,
      currentPrice: 98
    },
    { 
      crop: 'Potatoes', 
      priceChange: '+5%', 
      demand: 'Stable',
      insight: 'Consistent demand throughout year. Cold storage inventory management key.',
      previousYearPrice: 18,
      currentPrice: 19
    }
  ],
  seasonalInsights: [
    { season: 'Summer 2023', topCrop: 'Mangoes', avgMargin: '28%', keyEvent: 'Export demand surge' },
    { season: 'Monsoon 2023', topCrop: 'Rice', avgMargin: '22%', keyEvent: 'Good rainfall distribution' },
    { season: 'Winter 2023-24', topCrop: 'Wheat', avgMargin: '25%', keyEvent: 'Government procurement at MSP' },
    { season: 'Post-Monsoon 2024', topCrop: 'Onions', avgMargin: '18%', keyEvent: 'Storage shortage led to price volatility' }
  ],
  priceComparison: [
    { month: 'Jan', previous: 45000, current: 52000 },
    { month: 'Feb', previous: 52000, current: 58000 },
    { month: 'Mar', previous: 48000, current: 55000 },
    { month: 'Apr', previous: 61000, current: 68000 },
    { month: 'May', previous: 55000, current: 62000 },
    { month: 'Jun', previous: 67000, current: 75000 },
    { month: 'Jul', previous: 72000, current: 82000 },
    { month: 'Aug', previous: 69000, current: 79000 },
    { month: 'Sep', previous: 58000, current: 65000 },
    { month: 'Oct', previous: 63000, current: 72000 },
    { month: 'Nov', previous: 71000, current: 85000 },
    { month: 'Dec', previous: 78000, current: 92000 }
  ]
};

const Analytics = () => {
  const { t } = useLanguage();
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const totalRevenue = monthlySalesData.reduce((acc, curr) => acc + curr.sales, 0);
  const totalOrders = monthlySalesData.reduce((acc, curr) => acc + curr.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Summer';
    if (month >= 5 && month <= 8) return 'Monsoon';
    if (month >= 9 && month <= 10) return 'Post-Monsoon';
    return 'Winter';
  };

  const currentSeason = getCurrentSeason();
  const currentSeasonData = seasonalData.find(s => s.season === currentSeason);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">{t.analytics.title}</h1>
          <p className="text-muted-foreground">{t.analytics.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t.common.filter}:</span>
          </div>
          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.analytics.filterBySeason} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.common.all}</SelectItem>
              <SelectItem value="summer">{t.analytics.summer}</SelectItem>
              <SelectItem value="monsoon">{t.analytics.monsoon}</SelectItem>
              <SelectItem value="winter">{t.analytics.winter}</SelectItem>
              <SelectItem value="post-monsoon">{t.analytics.postMonsoon}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.analytics.filterByCategory} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.common.all}</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
              <SelectItem value="grains">Grains</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.analytics.filterByLocation} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.common.all}</SelectItem>
              <SelectItem value="punjab">Punjab</SelectItem>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
              <SelectItem value="karnataka">Karnataka</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                {t.analytics.revenue} ({t.analytics.last2Years})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-sm text-green-500 mt-1">+18.2% vs previous</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t.analytics.orders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalOrders.toLocaleString()}</p>
              <p className="text-sm text-green-500 mt-1">+12.5% vs previous</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{avgOrderValue}</p>
              <p className="text-sm text-green-500 mt-1">+5.8% vs previous</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.analytics.mostDemanded}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentSeasonData?.topProduct}</p>
              <Badge className="mt-2">{currentSeason}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>{t.analytics.monthlySales}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlySalesData.slice(-12)}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#salesGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t.analytics.topProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProductsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Seasonal Trends */}
          <Card>
            <CardHeader>
              <CardTitle>{t.analytics.seasonalTrends}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="season" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {seasonalData.map((season) => (
                  <div key={season.season} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                    <span className="font-medium">{season.season}</span>
                    <span className="text-muted-foreground">Top: {season.topProduct}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Sales by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-muted-foreground" />
                  <YAxis type="category" dataKey="location" width={100} className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Previous Year Market Analysis Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            {t.analytics.previousYearAnalysis}
          </h2>

          {/* Year over Year Comparison Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t.analytics.yearOverYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={previousYearAnalysis.priceComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Previous Year"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Current Year"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Market Trends Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {previousYearAnalysis.marketTrends.map((trend, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {trend.crop}
                    <Badge 
                      variant={trend.priceChange.startsWith('+') ? 'default' : 'destructive'}
                      className={trend.priceChange.startsWith('+') ? 'bg-green-500/20 text-green-500' : ''}
                    >
                      {trend.priceChange}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Demand:</span>
                    <Badge variant="outline">{trend.demand}</Badge>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground">₹{trend.previousYearPrice}/kg → ₹{trend.currentPrice}/kg</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{trend.insight}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Seasonal Insights Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t.analytics.seasonalInsights}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Season</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Top Crop</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Avg Margin</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Key Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousYearAnalysis.seasonalInsights.map((insight, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{insight.season}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{insight.topCrop}</Badge>
                        </td>
                        <td className="py-3 px-4 text-green-500">{insight.avgMargin}</td>
                        <td className="py-3 px-4 text-muted-foreground">{insight.keyEvent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
