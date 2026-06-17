/**
 * ============================================================================
 * Cool Sir Edulife Academy — 华尔街投资体验
 * Google Apps Script Backend (Code.gs)
 *
 * Responsibilities:
 *   1. Receive POST requests from the registration form (index.html / script.js)
 *   2. Append a new row to the linked Google Sheet
 *   3. Send a bilingual confirmation email to the registrant
 *
 * Deployment:
 *   See README.md for the full step-by-step deployment guide.
 *   Quick version:
 *     1. Open your Google Sheet -> Extensions -> Apps Script
 *     2. Paste this entire file in, replacing any boilerplate code
 *     3. Click Deploy -> New deployment -> Type: Web app
 *          - Execute as: Me
 *          - Who has access: Anyone
 *     4. Copy the generated Web App URL
 *     5. Paste it into GOOGLE_SCRIPT_URL in script.js
 * ============================================================================
 */

/* ---------------------------------------------------------------------------
   CONFIG — adjust if you rename your sheet tab or want a different subject
   --------------------------------------------------------------------------- */
const SHEET_NAME = "Registrations";          // Name of the sheet tab to write to
const EMAIL_SUBJECT = "【报名成功】华尔街投资体验";
const EVENT_DATE = "15/08/2026（Saturday）";
const EVENT_TIME = "2:30PM - 4:30PM";
const EVENT_LOCATION = "YMCA, Penang";
const ACADEMY_NAME = "Cool Sir Edulife Academy";

/* ---------------------------------------------------------------------------
   Entry point: handles POST requests from the landing page form
   --------------------------------------------------------------------------- */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ result: "error", message: "No data received." });
    }

    const data = JSON.parse(e.postData.contents);

    // Basic server-side validation — mirrors the client-side checks
    const name = (data.name || "").toString().trim();
    const whatsapp = (data.whatsapp || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const experience = (data.experience || "").toString().trim();
    const goal = (data.goal || "").toString().trim();

    if (!name || !whatsapp || !email || !experience || !goal) {
      return jsonResponse({ result: "error", message: "Missing required fields." });
    }

    if (!isValidEmail(email)) {
      return jsonResponse({ result: "error", message: "Invalid email address." });
    }

    // 1. Write to Google Sheet
    appendToSheet({
      timestamp: new Date(),
      name: name,
      whatsapp: whatsapp,
      email: email,
      experience: experience,
      goal: goal
    });

    // 2. Send confirmation email (failure here should not block the registration)
    try {
      sendConfirmationEmail(name, email);
    } catch (emailErr) {
      console.error("Email sending failed: " + emailErr.message);
    }

    return jsonResponse({ result: "success" });
  } catch (err) {
    console.error("doPost error: " + err.message);
    return jsonResponse({ result: "error", message: "Server error: " + err.message });
  }
}

/* ---------------------------------------------------------------------------
   Optional: simple GET handler so visiting the Web App URL directly
   doesn't show a confusing blank error — useful for sanity-checking deployment
   --------------------------------------------------------------------------- */
function doGet(e) {
  return ContentService.createTextOutput(
    "Cool Sir Edulife Academy registration endpoint is running. Please submit via POST."
  ).setMimeType(ContentService.MimeType.TEXT);
}

/* ---------------------------------------------------------------------------
   Append a registration row to the Sheet
   Columns: Timestamp | Name | Whatsapp | Email | Experience | Learning Goal
   --------------------------------------------------------------------------- */
function appendToSheet(entry) {
  const sheet = getOrCreateSheet();
  sheet.appendRow([
    entry.timestamp,
    entry.name,
    entry.whatsapp,
    entry.email,
    entry.experience,
    entry.goal
  ]);
}

/* ---------------------------------------------------------------------------
   Get the target sheet, creating it with headers if it doesn't exist yet
   --------------------------------------------------------------------------- */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Whatsapp", "Email", "Experience", "Learning Goal"]);
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/* ---------------------------------------------------------------------------
   Send the bilingual confirmation email via Gmail (under the deploying account)
   --------------------------------------------------------------------------- */
function sendConfirmationEmail(name, email) {
  const subject = EMAIL_SUBJECT;

  const body =
    "您好 " + name + "，\n\n" +
    "感谢您报名参加：\n" +
    "《华尔街投资体验》\n\n" +
    "日期： " + EVENT_DATE + "\n" +
    "时间： " + EVENT_TIME + "\n" +
    "地点： " + EVENT_LOCATION + "\n\n" +
    "我们期待与您见面。\n\n" +
    ACADEMY_NAME;

  const htmlBody =
    '<div style="font-family: Arial, \'PingFang TC\', \'Microsoft JhengHei\', sans-serif; ' +
    'max-width: 520px; margin: 0 auto; color: #16213A;">' +
      '<div style="background: linear-gradient(135deg, #0F2545, #0A1628); padding: 28px 32px; border-radius: 12px 12px 0 0;">' +
        '<h1 style="color: #E3CC8E; font-size: 20px; margin: 0;">报名成功 🎉</h1>' +
        '<p style="color: #FAF9F6; font-size: 14px; margin: 6px 0 0;">华尔街投资体验</p>' +
      '</div>' +
      '<div style="background: #FFFFFF; border: 1px solid #E2DFD5; border-top: none; ' +
      'padding: 32px; border-radius: 0 0 12px 12px;">' +
        '<p style="font-size: 15px; line-height: 1.8;">您好 <strong>' + escapeHtml(name) + '</strong>，</p>' +
        '<p style="font-size: 15px; line-height: 1.8;">感谢您报名参加：<br><strong>《华尔街投资体验》</strong></p>' +
        '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">' +
          '<tr><td style="padding: 8px 0; color: #6B7A99;">📅 日期</td>' +
          '<td style="padding: 8px 0; font-weight: 600;">' + EVENT_DATE + '</td></tr>' +
          '<tr><td style="padding: 8px 0; color: #6B7A99;">🕑 时间</td>' +
          '<td style="padding: 8px 0; font-weight: 600;">' + EVENT_TIME + '</td></tr>' +
          '<tr><td style="padding: 8px 0; color: #6B7A99;">📍 地点</td>' +
          '<td style="padding: 8px 0; font-weight: 600;">' + EVENT_LOCATION + '</td></tr>' +
        '</table>' +
        '<p style="font-size: 15px; line-height: 1.8;">我们期待与您见面。</p>' +
        '<p style="font-size: 14px; color: #C9A24B; font-weight: 700; margin-top: 24px;">' + ACADEMY_NAME + '</p>' +
      '</div>' +
    '</div>';

  GmailApp.sendEmail(email, subject, body, {
    htmlBody: htmlBody,
    name: ACADEMY_NAME
  });
}

/* ---------------------------------------------------------------------------
   Utilities
   --------------------------------------------------------------------------- */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------------------------------------------------------------------
   Manual test helper — run this from the Apps Script editor (Run > testDoPost)
   to verify Sheet writing and email sending without needing the live form.
   --------------------------------------------------------------------------- */
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        name: "测试 Test User",
        whatsapp: "012-3456789",
        email: "your-test-email@example.com",
        experience: "完全没有经验（小白）",
        goal: "测试提交内容"
      })
    }
  };
  const result = doPost(fakeEvent);
  console.log(result.getContent());
}
