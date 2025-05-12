interface SMSOptions {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SMSOptions) {
  // Burada gerçek bir SMS servisi entegrasyonu yapılabilir
  // Örnek: Twilio, Nexmo, vb.
  console.log('SMS gönderildi:', { to, message });
  
  // Şimdilik sadece konsola yazdırıyoruz
  return Promise.resolve();
} 