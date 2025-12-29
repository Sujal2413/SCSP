import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-wrapper">

      {/* LEFT SIDE */}
      <div className="contact-left">
        <h1>Contact Us</h1>

        <p className="contact-desc">
          We'd love to hear from you. Reach out for queries, support, or feedback.
        </p>

        <div className="contact-info">
          <h3>Email</h3>
          <p>support@scsp.org</p>

          <h3>Phone</h3>
          <p>+1 (222) 333-4444</p>

          <h3>Office</h3>
          <p>
            SCSP Headquarters <br />
            2769 Green Station, Eules <br />
            Oregon, 26790, USA
          </p>
        </div>
      </div>

      {/* RIGHT SIDE FORM CARD */}
      <div className="contact-card">
        <h2>Write Us a Message</h2>

        <form className="contact-form">

          {/* First & Last Name */}
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter your first name" />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter your last name" />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" placeholder="Enter your contact number" />
            </div>
          </div>

          {/* Message */}
          <div className="form-group full-width">
            <label>Message</label>
            <textarea placeholder="Write your message..." />
          </div>

          {/* Checkbox */}
          <div className="checkbox-wrapper">
            <input type="checkbox" id="privacy" />
            <label htmlFor="privacy">I agree to the Privacy Policy.</label>
          </div>

          <button className="send-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
}
