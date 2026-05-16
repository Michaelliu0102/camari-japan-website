/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/error", "N/record", "N/runtime", "N/search"], (error, record, runtime, search) => {
  const RECORD_TYPE = "customrecord_camari_newsletter";
  const PARAM_DRY_RUN = "custscript_camari_newsletter_dryrun";
  const FIELDS = {
    email: "custrecord_camari_news_email",
    locale: "custrecord_camari_news_locale",
    source: "custrecord_camari_news_source",
    submittedAt: "custrecord_camari_news_submitted",
    receivedAt: "custrecord_camari_news_received",
    payload: "custrecord_camari_news_payload",
  };
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fail(name, message) {
    throw error.create({
      name,
      message,
      notifyOff: true,
    });
  }

  function normalizeText(value, fallback) {
    if (typeof value !== "string") {
      return fallback;
    }

    const trimmed = value.trim();
    return trimmed || fallback;
  }

  function normalizeSubmission(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      fail("INVALID_NEWSLETTER_PAYLOAD", "Expected a JSON object payload.");
    }

    const email = normalizeText(body.email, "").toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      fail("INVALID_NEWSLETTER_EMAIL", "Expected a valid email address.");
    }

    const submittedAt = normalizeText(body.submittedAt, "");
    const submittedDate = new Date(submittedAt);
    if (!submittedAt || Number.isNaN(submittedDate.getTime())) {
      fail("INVALID_NEWSLETTER_SUBMITTED_AT", "Expected submittedAt to be an ISO date string.");
    }

    return {
      email,
      locale: normalizeText(body.locale, "unknown").slice(0, 16),
      source: normalizeText(body.source, "unknown").slice(0, 64),
      submittedAt: submittedDate,
      receivedAt: new Date(),
      payload: JSON.stringify(body).slice(0, 100000),
    };
  }

  function isDryRun() {
    const value = runtime.getCurrentScript().getParameter({ name: PARAM_DRY_RUN });
    return value !== false && value !== "F";
  }

  function findExistingSubscription(email) {
    const results = search
      .create({
        type: RECORD_TYPE,
        filters: [[FIELDS.email, "is", email]],
        columns: ["internalid"],
      })
      .run()
      .getRange({ start: 0, end: 1 });

    if (!results || results.length === 0) {
      return null;
    }

    return results[0].getValue({ name: "internalid" });
  }

  function setSubscriptionFields(subscriptionRecord, submission) {
    subscriptionRecord.setValue({ fieldId: "name", value: submission.email });
    subscriptionRecord.setValue({ fieldId: FIELDS.email, value: submission.email });
    subscriptionRecord.setValue({ fieldId: FIELDS.locale, value: submission.locale });
    subscriptionRecord.setValue({ fieldId: FIELDS.source, value: submission.source });
    subscriptionRecord.setValue({ fieldId: FIELDS.submittedAt, value: submission.submittedAt });
    subscriptionRecord.setValue({ fieldId: FIELDS.receivedAt, value: submission.receivedAt });
    subscriptionRecord.setValue({ fieldId: FIELDS.payload, value: submission.payload });
  }

  function post(body) {
    const submission = normalizeSubmission(body);
    const existingId = findExistingSubscription(submission.email);
    const action = existingId ? "updated" : "created";

    if (isDryRun()) {
      return {
        ok: true,
        dryRun: true,
        action: `would_${action}`,
        email: submission.email,
      };
    }

    const subscriptionRecord = existingId
      ? record.load({ type: RECORD_TYPE, id: existingId, isDynamic: false })
      : record.create({ type: RECORD_TYPE, isDynamic: false });

    setSubscriptionFields(subscriptionRecord, submission);

    return {
      ok: true,
      dryRun: false,
      action,
      recordId: subscriptionRecord.save({
        enableSourcing: false,
        ignoreMandatoryFields: false,
      }),
    };
  }

  return { post };
});
