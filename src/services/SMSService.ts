// src/services/SMSService.ts

/**
 * Simple SMS Service for OTP simulation
 */
class SMSService {
  /**
   * Send OTP (simulation mode only)
   */
  static async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    // Log to console for development
    console.log(`📱 OTP for +91${phoneNumber}: ${otp}`);
    
    // Store for verification
    localStorage.setItem(`otp_${phoneNumber}`, otp);
    localStorage.setItem(`otp_expiry_${phoneNumber}`, (Date.now() + 5 * 60 * 1000).toString());
    
    // Show alert or console message
    alert(`Demo OTP Sent!\nPhone: +91${phoneNumber}\nOTP: ${otp}\n\n(In production, this would be sent via SMS)`);
    
    return true;
  }

  /**
   * Verify OTP
   */
  static verifyOTP(phoneNumber: string, userOtp: string): { success: boolean; message: string } {
    const storedOtp = localStorage.getItem(`otp_${phoneNumber}`);
    const expiry = localStorage.getItem(`otp_expiry_${phoneNumber}`);
    
    if (!storedOtp || !expiry) {
      return { success: false, message: 'OTP expired or not found' };
    }
    
    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem(`otp_${phoneNumber}`);
      localStorage.removeItem(`otp_expiry_${phoneNumber}`);
      return { success: false, message: 'OTP has expired' };
    }
    
    if (storedOtp !== userOtp) {
      return { success: false, message: 'Invalid OTP' };
    }
    
    // Clear after verification
    localStorage.removeItem(`otp_${phoneNumber}`);
    localStorage.removeItem(`otp_expiry_${phoneNumber}`);
    
    return { success: true, message: 'OTP verified successfully' };
  }
}

export default SMSService;