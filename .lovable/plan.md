

# Plan: Real-Time Farmer-Buyer Order Communication System

## Overview

This plan implements a fully functional order communication system where buyers can place orders that appear instantly on farmers' dashboards, farmers can reply to orders, and both parties receive real-time notifications.

---

## Database Schema

Two new tables will be created:

### `orders` Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| buyer_id | uuid | References the buyer's user ID |
| farmer_id | uuid | References the farmer's user ID |
| crop_id | uuid | References the crop (nullable for direct orders) |
| crop_name | text | Name of the ordered crop |
| quantity | integer | Quantity ordered |
| message | text | Buyer's order message/note |
| status | text | Order status: 'pending', 'replied', 'accepted', 'rejected' |
| created_at | timestamp | Order creation time |
| updated_at | timestamp | Last update time |

### `order_replies` Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| order_id | uuid | References the order |
| sender_id | uuid | User who sent the reply |
| message | text | Reply message content |
| reply_type | text | Type: 'accept', 'reject', 'counter_offer', 'message' |
| created_at | timestamp | Reply creation time |

### Security
- Row-Level Security (RLS) policies ensure:
  - Buyers can only see/create their own orders
  - Farmers can only see orders directed to them
  - Both parties can view/send replies on their orders
- Real-time subscriptions enabled on both tables

---

## Implementation Phases

### Phase 1: Database Setup
Create the `orders` and `order_replies` tables with proper RLS policies and real-time enabled.

### Phase 2: Custom Hooks
Create two new hooks:
- **`useOrders`**: Fetches and manages orders with real-time subscriptions
- **`useOrderReplies`**: Handles replies with real-time updates

### Phase 3: UI Components

#### For Buyers (BuyerDashboard):
- **PlaceOrderModal**: Modal to send order requests to farmers
- **MyOrders**: Section showing buyer's orders with status and farmer replies
- Enhanced notification bell for reply notifications

#### For Farmers (FarmerDashboard):
- **IncomingOrders**: New section showing real-time incoming orders with:
  - Buyer name and email
  - Product name and quantity
  - Order message and timestamp
- **ReplyToOrderModal**: Modal for farmers to reply (accept/reject/counter-offer)

### Phase 4: Notification Integration
Update the existing `NotificationBell` component to:
- Listen for new orders (farmers)
- Listen for order replies (buyers)
- Display unread count and notification list

---

## Technical Details

### File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useOrders.ts` | Create | Hook for order CRUD and real-time sync |
| `src/hooks/useOrderReplies.ts` | Create | Hook for reply management |
| `src/components/orders/PlaceOrderModal.tsx` | Create | Buyer order placement modal |
| `src/components/orders/IncomingOrders.tsx` | Create | Farmer incoming orders panel |
| `src/components/orders/ReplyToOrderModal.tsx` | Create | Farmer reply modal |
| `src/components/orders/MyOrders.tsx` | Create | Buyer's order list with replies |
| `src/pages/FarmerDashboard.tsx` | Modify | Add IncomingOrders section |
| `src/pages/BuyerDashboard.tsx` | Modify | Add PlaceOrderModal and MyOrders |
| `src/pages/Marketplace.tsx` | Modify | Add "Place Order" button functionality |
| `src/components/NotificationBell.tsx` | Modify | Add order/reply listeners |

### useOrders Hook Structure

```text
- fetchOrders(): Get orders based on user role
- placeOrder(): Create new order (buyer)
- updateOrderStatus(): Update order status (farmer)
- Real-time subscription for new/updated orders
```

### useOrderReplies Hook Structure

```text
- fetchReplies(orderId): Get replies for an order
- sendReply(): Send reply message
- Real-time subscription for new replies
```

### Real-Time Flow

```text
Buyer places order
        |
        v
    Database INSERT (orders)
        |
        v
    Real-time event fires
        |
        v
    Farmer's IncomingOrders updates
    Farmer's NotificationBell shows badge
        |
        v
    Farmer clicks "Reply"
        |
        v
    Reply saved to order_replies
        |
        v
    Real-time event fires
        |
        v
    Buyer's MyOrders updates
    Buyer's NotificationBell shows badge
```

---

## Edge Cases Handled

1. **Empty reply prevention**: Validate reply message before submission
2. **Duplicate notifications prevention**: Track notification IDs to avoid duplicates
3. **Role-based access**: RLS policies enforce data isolation
4. **Status flow**: Orders transition through pending -> replied -> accepted/rejected
5. **Real-time sync**: Both dashboards update without page refresh
6. **Data persistence**: All data stored in database, persists after reload

---

## User Flow Summary

### Buyer Flow:
1. Browse marketplace or buyer dashboard
2. Click "Place Order" on a product
3. Fill in quantity and message
4. Submit order
5. Receive real-time notification when farmer replies
6. View reply in "My Orders" section

### Farmer Flow:
1. Log into farmer dashboard
2. See new orders in "Incoming Orders" panel (real-time)
3. Click "Reply to Buyer" button
4. Write response (accept/reject/counter-offer)
5. Submit reply
6. Order status updates automatically

