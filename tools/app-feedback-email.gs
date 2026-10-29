/* =========================================================
App Feedback emails (Google Apps Script)
Spec: docs/specs/app-feedback-emails.md · Setup: docs/app-feedback-email-setup.md

Runs on the app's shared Gmail account. Supabase calls it (Database
Webhook) for every new App Feedback row; it emails a receipt to the
Teacher and an alert to the group.

Settings live in Project Settings → Script Properties, never here
(this file is in a public repo):
  WEBHOOK_KEY   long random secret, also in the webhook's URL (?key=…)
  ALERT_TO      the group's addresses, comma-separated
========================================================= */

const SENDER_NAME = "OE Map Maker";


function doPost(e) {
  const settings = PropertiesService.getScriptProperties();

  // Without the key, anyone who found this address could send email.
  if (!e || !e.parameter || e.parameter.key !== settings.getProperty("WEBHOOK_KEY")) {
    return reply("forbidden");
  }

  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (error) {
    return reply("bad json");
  }

  if (payload.type !== "INSERT" || payload.table !== "app_feedback" || !payload.record) {
    return reply("ignored");
  }

  const feedback = payload.record;
  const results = [];

  // Each email is tried on its own: one failing never stops the other.
  try {
    sendAlert(feedback, settings.getProperty("ALERT_TO"));
    results.push("alert sent");
  } catch (error) {
    console.error("Alert failed", error);
    results.push("alert failed");
  }

  try {
    if (isEmail(feedback.teacher_email)) {
      sendReceipt(feedback);
      results.push("receipt sent");
    } else {
      results.push("no teacher email");
    }
  } catch (error) {
    console.error("Receipt failed", error);
    results.push("receipt failed");
  }

  return reply(results.join(", "));
}


function sendReceipt(feedback) {
  MailApp.sendEmail({
    to: feedback.teacher_email,
    name: SENDER_NAME,
    subject: "We got your App Feedback",
    body: [
      `Hi ${feedback.teacher_name || "there"},`,
      "",
      "Thanks for your App Feedback on OE Map Maker. This is what you sent:",
      "",
      quote(feedback.message),
      "",
      screenshotLine(feedback),
      "",
      "Reply to this email if you want to add anything.",
      "",
      "The OE Map Maker team"
    ].join("\n")
  });
}


function sendAlert(feedback, alertTo) {
  if (!alertTo) {
    throw new Error("ALERT_TO is not set in Script Properties.");
  }

  const who = feedback.teacher_name || feedback.teacher_email || "a Teacher";
  const shots = feedback.screenshot_paths || [];

  MailApp.sendEmail({
    to: alertTo,
    name: SENDER_NAME,
    replyTo: isEmail(feedback.teacher_email) ? feedback.teacher_email : undefined,
    subject: `New App Feedback from ${who}`,
    body: [
      `From:   ${feedback.teacher_name || "(no name)"} <${feedback.teacher_email || "no email"}>`,
      `When:   ${feedback.created_at}`,
      `Screen: ${feedback.screen || "unknown"}`,
      `Task:   ${feedback.task_title || "none"}`,
      `Browser: ${feedback.user_agent || "unknown"}`,
      "",
      quote(feedback.message),
      "",
      shots.length
        ? `${screenshotLine(feedback)} In Supabase: Storage → app-feedback →\n` +
          shots.map(path => `  ${path}`).join("\n")
        : "No screenshots.",
      "",
      `App Feedback id: ${feedback.id}`,
      "Reply to this email to answer the Teacher. Delete this email once the App Feedback is dealt with."
    ].join("\n")
  });
}


function screenshotLine(feedback) {
  const count = (feedback.screenshot_paths || []).length;
  return count === 0
    ? "No screenshots were attached."
    : `${count} screenshot${count === 1 ? " was" : "s were"} attached.`;
}


function quote(text) {
  return String(text || "")
    .split("\n")
    .map(line => `> ${line}`)
    .join("\n");
}


function isEmail(text) {
  return typeof text === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}


function reply(text) {
  return ContentService.createTextOutput(text);
}


// Run once from the editor to grant permission to send email and to
// check both emails arrive (the receipt goes to the account itself).
function testSend() {
  sendAlert({
    id: "test",
    teacher_name: "Test Teacher",
    teacher_email: Session.getActiveUser().getEmail(),
    created_at: new Date().toISOString(),
    screen: "Gallery",
    task_title: "Test Task",
    user_agent: "Apps Script test",
    message: "This is a test of App Feedback emails.",
    screenshot_paths: []
  }, PropertiesService.getScriptProperties().getProperty("ALERT_TO"));

  sendReceipt({
    teacher_name: "Test Teacher",
    teacher_email: Session.getActiveUser().getEmail(),
    message: "This is a test of App Feedback emails.",
    screenshot_paths: []
  });
}
