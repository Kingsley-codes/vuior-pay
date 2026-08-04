"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="panel-heading"><h2>Send us a message</h2><p>Fill out the form below and our team will respond shortly.</p></div>
      <label>Full name<input required name="name" placeholder="Enter your full name" /></label>
      <label>Email address<input required type="email" name="email" placeholder="Enter your email address" /></label>
      <label>Subject<select required name="subject" defaultValue=""><option value="" disabled>Select a subject</option><option>Account support</option><option>Payments and bills</option><option>Rewards</option><option>Feedback</option><option>Something else</option></select></label>
      <label>Message<textarea required name="message" placeholder="How can we help you?" /></label>
      <button className="contact-submit" type="submit">{sent ? "Message sent — thank you!" : "Send message"}</button>
      <p className="response-note" aria-live="polite">{sent ? "We’ll be in touch shortly." : "We typically respond within 24 hours on business days."}</p>
    </form>
  );
}
