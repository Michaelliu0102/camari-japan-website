/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/error", "N/record", "N/runtime", "N/search"], (error, record, runtime, search) => {
  const RECORD_TYPE = "customrecord_camari_inquiry";
  const PARAM_DRY_RUN = "custscript_camari_inquiry_dryrun";
  const FIELDS = {
    submissionId: "custrecord_camari_inquiry_submission",
    locale: "custrecord_camari_inquiry_locale",
    name: "custrecord_camari_inquiry_name",
    email: "custrecord_camari_inquiry_email",
    phone: "custrecord_camari_inquiry_phone",
    company: "custrecord_camari_inquiry_company",
    countryCode: "custrecord_camari_inquiry_countrycode",
    countryRegion: "custrecord_camari_inquiry_country",
    interests: "custrecord_camari_inquiry_interests",
    article: "custrecord_camari_inquiry_article",
    message: "custrecord_camari_inquiry_message",
    pageUrl: "custrecord_camari_inquiry_pageurl",
    submittedAt: "custrecord_camari_inquiry_submitted",
    receivedAt: "custrecord_camari_inquiry_received",
    payload: "custrecord_camari_inquiry_payload",
  };
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;

  function fail(name, message) {
    throw error.create({ name, message, notifyOff: true });
  }

  function normalizeText(value, fallback, maxLength) {
    const normalized = typeof value === "string" ? value.trim() : "";
    return (normalized || fallback).slice(0, maxLength);
  }

  function normalizeSubmission(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      fail("INVALID_INQUIRY_PAYLOAD", "Expected a JSON object payload.");
    }

    const locale = normalizeText(body.locale, "en", 16);
    const submissionId = normalizeText(body.submissionId, "", 64);
    const name = normalizeText(body.name, "", 200);
    const email = normalizeText(body.email, "", 254).toLowerCase();
    const company = normalizeText(body.company, "", 300);
    const message = normalizeText(body.message, "", 100000);
    const requestedCountryCode = normalizeText(body.countryCode, "", 2).toUpperCase();
    const countryCode = locale === "ja" ? "JP" : requestedCountryCode;
    const countryRegion = locale === "ja"
      ? "Japan"
      : normalizeText(body.countryRegion, "", 128);
    const submittedAt = new Date(normalizeText(body.submittedAt, "", 64));

    if (!submissionId || !name || !company || !message) {
      fail("MISSING_INQUIRY_FIELDS", "Submission ID, name, company, and message are required.");
    }
    if (!EMAIL_PATTERN.test(email)) {
      fail("INVALID_INQUIRY_EMAIL", "Expected a valid business email address.");
    }
    if (!COUNTRY_CODE_PATTERN.test(countryCode) || !countryRegion) {
      fail("INVALID_INQUIRY_COUNTRY", "Expected a valid country or region.");
    }
    if (Number.isNaN(submittedAt.getTime())) {
      fail("INVALID_INQUIRY_SUBMITTED_AT", "Expected submittedAt to be an ISO date string.");
    }

    return {
      submissionId,
      locale,
      name,
      email,
      phone: normalizeText(body.phone, "", 100),
      company,
      countryCode,
      countryRegion,
      interests: Array.isArray(body.interests)
        ? body.interests.map((item) => normalizeText(item, "", 64)).filter(Boolean).slice(0, 6).join(", ")
        : "",
      article: normalizeText(body.article, "", 300),
      message,
      pageUrl: normalizeText(body.pageUrl, "", 1000),
      submittedAt,
      receivedAt: new Date(),
      payload: JSON.stringify(body).slice(0, 100000),
    };
  }

  function isDryRun() {
    const value = runtime.getCurrentScript().getParameter({ name: PARAM_DRY_RUN });
    return value !== false && value !== "F";
  }

  function findExistingInquiry(submissionId) {
    const results = search
      .create({
        type: RECORD_TYPE,
        filters: [[FIELDS.submissionId, "is", submissionId]],
        columns: ["internalid"],
      })
      .run()
      .getRange({ start: 0, end: 1 });

    return results && results.length
      ? results[0].getValue({ name: "internalid" })
      : null;
  }

  function setValue(inquiryRecord, fieldId, value) {
    if (value !== "" && value !== null && value !== undefined) {
      inquiryRecord.setValue({ fieldId, value });
    }
  }

  function post(body) {
    const inquiry = normalizeSubmission(body);
    const existingId = findExistingInquiry(inquiry.submissionId);

    if (existingId) {
      return { ok: true, dryRun: isDryRun(), action: "duplicate", recordId: existingId };
    }

    if (isDryRun()) {
      return {
        ok: true,
        dryRun: true,
        action: "would_create",
        submissionId: inquiry.submissionId,
        countryCode: inquiry.countryCode,
      };
    }

    const inquiryRecord = record.create({ type: RECORD_TYPE, isDynamic: false });
    inquiryRecord.setValue({ fieldId: "name", value: `${inquiry.company} - ${inquiry.name}`.slice(0, 300) });

    Object.entries(FIELDS).forEach(([key, fieldId]) => {
      setValue(inquiryRecord, fieldId, inquiry[key]);
    });

    return {
      ok: true,
      dryRun: false,
      action: "created",
      recordId: inquiryRecord.save({
        enableSourcing: false,
        ignoreMandatoryFields: false,
      }),
    };
  }

  return { post };
});
