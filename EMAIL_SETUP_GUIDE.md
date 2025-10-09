# Email Contact Form Setup Guide

Your footer email capture is now functional! Here's how to complete the setup:

## 🎯 What We Built

**Option C: Hybrid Approach**
- ✅ Quick email capture in footer (for newsletter/interest)
- ✅ Link to full contact page (for detailed project inquiries)
- ✅ Email validation
- ✅ Loading states
- ✅ Success/error feedback
- ✅ Accessible & responsive
- ✅ GSAP animations

---

## 🚀 Quick Setup - ✅ COMPLETED!

### ✅ Formspree Configuration (DONE)

Your Formspree endpoint has been configured:
- **Endpoint:** `https://formspree.io/f/myzndvlb`
- **Status:** Ready to use! 🎉

### Next Steps:

1. **Test it!**
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:5173/` or `http://localhost:5173/about`
   - Enter your email in the footer
   - Click the arrow button
   - You should see: "Thanks! You're on the list ✓" (green)

2. **Check submissions**
   - Go to your [Formspree dashboard](https://formspree.io/forms)
   - View all email submissions
   - Set up email notifications if desired

**Your form is ready to use!** 🎉

---

### Option 2: EmailJS (Alternative)

If you prefer EmailJS:

1. **Sign up at [EmailJS.com](https://www.emailjs.com/)**
   - Free tier: 200 emails/month

2. **Get your credentials**
   - Public Key
   - Service ID
   - Template ID

3. **Uncomment EmailJS code in `/script/footer.js`**
   - Lines 115-181 have the EmailJS implementation
   - Comment out the Formspree class (lines 11-113)
   - Replace the placeholder values with your credentials

---

### Option 3: Vercel Serverless Function (Advanced)

For full control with your own backend:

1. **Create `/api/subscribe.js`**
   ```javascript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
   
     const { email } = req.body;
     
     try {
       await resend.emails.send({
         from: 'onboarding@resend.dev',
         to: 'your@email.com',
         subject: 'New Newsletter Signup',
         html: `<p>New signup: ${email}</p>`
       });
       
       return res.status(200).json({ success: true });
     } catch (error) {
       return res.status(500).json({ error: 'Failed to send' });
     }
   }
   ```

2. **Update endpoint in footer.js**
   ```javascript
   const FORMSPREE_ENDPOINT = "/api/subscribe";
   ```

3. **Add Resend API key to Vercel**
   - Sign up at [Resend.com](https://resend.com)
   - Get API key
   - Add to Vercel environment variables

---

## 🎨 Customization

### Change Success Message
In `/script/footer.js` line 50:
```javascript
this.showFeedback("Thanks! You're on the list ✓", "success");
```

### Change Error Message
In `/script/footer.js` line 57:
```javascript
this.showFeedback("Something went wrong. Please try again.", "error");
```

### Change Helper Text
In `/index.html` lines 569-572:
```html
<p class="footer-email-helper">
  Stay updated on new projects and ideas. For project inquiries, 
  <a href="/contact" class="footer-contact-link">let's talk →</a>
</p>
```

### Change Colors
In `/css/footer.css`:
```css
/* Success color (line 175) */
footer .footer-email-feedback.success {
  color: #00ff00; /* Change to your brand color */
}

/* Error color (line 179) */
footer .footer-email-feedback.error {
  color: #ff4444; /* Change to your error color */
}

/* Link color (line 156) */
footer .footer-contact-link {
  color: #00ff00; /* Change to your brand color */
}
```

---

## 📱 Features Included

- ✅ **Email Validation** - Regex-based validation
- ✅ **Loading States** - Button spins while submitting
- ✅ **Success/Error Feedback** - Clear visual feedback
- ✅ **Accessibility** - ARIA labels, screen reader support
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **GSAP Animations** - Smooth feedback animations
- ✅ **Auto-hide Success** - Success message disappears after 5s
- ✅ **Disabled States** - Input/button disabled while loading
- ✅ **Form Reset** - Clears after successful submission

---

## 🧪 Testing

1. **Valid Email Test**
   - Enter: `test@example.com`
   - Should show: "Thanks! You're on the list ✓" (green)

2. **Invalid Email Test**
   - Enter: `notanemail`
   - Should show: "Please enter a valid email address" (red)

3. **Network Error Test**
   - With wrong endpoint, should show: "Something went wrong. Please try again." (red)

4. **Loading State Test**
   - Button should spin while submitting
   - Input should be disabled

---

## 🔒 Security & Privacy

- ✅ Client-side validation
- ✅ Rate limiting (via Formspree/EmailJS)
- ✅ HTTPS only
- ✅ No sensitive data stored client-side
- ⚠️ Add honeypot field for extra spam protection (optional)

---

## 🐛 Troubleshooting

### "Nothing happens when I click submit"
- Check browser console for errors
- Verify endpoint URL is correct
- Check Formspree/EmailJS dashboard

### "CORS error"
- Formspree/EmailJS should handle CORS automatically
- If using custom backend, add CORS headers

### "Form doesn't reset after submission"
- Check if submission was actually successful
- Look for JavaScript errors in console

---

## 📊 Analytics (Optional)

Track submissions by adding to `trackSubmission()` method in `/script/footer.js`:

```javascript
trackSubmission(email) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'newsletter_signup', {
      method: 'footer_form'
    });
  }
  
  // Plausible
  if (typeof plausible !== 'undefined') {
    plausible('Newsletter Signup');
  }
}
```

---

## 🎉 Next Steps

1. Set up Formspree (5 minutes)
2. Test the form
3. Customize messages/colors
4. Add to other pages (about.html, work.html, etc.)
5. Set up analytics (optional)

---

## 💡 Tips

- Monitor your Formspree dashboard for submissions
- Set up email notifications in Formspree
- Consider adding a privacy policy link
- Export email list regularly for backup
- Integrate with your email marketing tool (Mailchimp, ConvertKit, etc.)

---

## 🆘 Need Help?

- **Formspree Docs**: https://help.formspree.io/
- **EmailJS Docs**: https://www.emailjs.com/docs/
- **Vercel Functions**: https://vercel.com/docs/functions

---

**Built with ❤️ using GSAP, Vite, and modern web standards.**

