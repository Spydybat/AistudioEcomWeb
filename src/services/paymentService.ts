const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const paymentService = {
  createOrder: async (amount: number, currency: string = "INR") => {
    try {
      const response = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  verifyPayment: async (data: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) => {
    try {
      const response = await fetch(`${API_URL}/api/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }
};
