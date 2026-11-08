const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function logPass(msg) {
  passed++;
  console.log(`  ✓ [PASS] ${msg}`);
}

function logFail(msg, err) {
  failed++;
  console.error(`  ✗ [FAIL] ${msg}`);
  console.error(`         ${err.message || err}`);
}

function req(options, postData = null) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json,
        });
      });
    });
    request.on('error', reject);
    if (postData) {
      request.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    request.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('BEYANCO AI — PRODUCT VALIDATION & WAITLIST VERIFICATION');
  console.log('======================================================\n');

  // 1. ROUTE VERIFICATION
  console.log('--- 1. PRIMARY ROUTES AVAILABILITY ---');
  
  const routes = [
    { path: '/', expectedText: 'Empty Rooms' },
    { path: '/feedback', expectedText: 'Help Us Build Beyanco' },
    { path: '/feedback/thank-you', expectedText: 'Your Opinion Matters' },
    { path: '/admin/validation', expectedText: 'Customer Validation' },
    { path: '/staging/new', expectedText: '' },
    { path: '/dashboard', expectedText: '' },
  ];

  for (const r of routes) {
    try {
      const res = await req({
        hostname: 'localhost',
        port: 3000,
        path: r.path,
        method: 'GET',
      });
      assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
      if (r.expectedText) {
        assert(res.body.includes(r.expectedText), `Expected body to include "${r.expectedText}"`);
      }
      logPass(`Route ${r.path} returns HTTP 200 and matches content`);
    } catch (e) {
      logFail(`Route ${r.path}`, e);
    }
  }

  // 2. WAITLIST API & PERSISTENCE
  console.log('\n--- 2. WAITLIST API & DUPLICATE PERSISTENCE ---');
  
  const testEmail = `agent_${Date.now()}@luxurymiami.com`;
  let waitlistId = null;

  try {
    const res = await req(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/waitlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Victoria Vance',
        email: testEmail,
        professionalRole: 'Real Estate Agency Owner',
        company: 'Vance International Properties',
        country: 'United States',
        city: 'Miami',
        marketingConsent: true,
        source: 'verification_script',
      }
    );

    assert.strictEqual(res.statusCode, 201, `Waitlist submission status ${res.statusCode}`);
    assert(res.json?.success === true, 'Waitlist response success === true');
    assert(res.json?.id, 'Waitlist returned ID');
    assert.strictEqual(res.json?.isDuplicate, false, 'First submission is not duplicate');
    waitlistId = res.json.id;
    logPass(`POST /api/v1/waitlist registered new entry (ID: ${waitlistId})`);
  } catch (e) {
    logFail('POST /api/v1/waitlist new registration', e);
  }

  // Duplicate email test
  try {
    const res = await req(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/waitlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Victoria Vance Updated',
        email: testEmail,
        professionalRole: 'Real Estate Agency Owner',
        company: 'Vance International Properties LLC',
      }
    );

    assert.strictEqual(res.statusCode, 201);
    assert(res.json?.success === true);
    assert.strictEqual(res.json?.isDuplicate, true, 'Duplicate email recognized');
    logPass('POST /api/v1/waitlist safely handles duplicate email without crashing');
  } catch (e) {
    logFail('Waitlist duplicate detection', e);
  }

  // Invalid email validation test
  try {
    const res = await req(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/waitlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Bad Email User',
        email: 'not-an-email',
      }
    );

    assert.strictEqual(res.statusCode, 400, 'Invalid email rejected with 400');
    assert.strictEqual(res.json?.success, false);
    logPass('POST /api/v1/waitlist rejects invalid email formatting');
  } catch (e) {
    logFail('Waitlist invalid email rejection', e);
  }

  // 3. CUSTOMER DISCOVERY & VALIDATION SURVEY API
  console.log('\n--- 3. CUSTOMER SURVEY & WILLINGNESS-TO-PAY API ---');

  try {
    const res = await req(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/feedback',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        waitlistId,
        role: 'Interior Designer',
        country: 'India',
        city: 'Mumbai',
        company: 'Atelier K',
        propertyVolume: '6–10',
        currentWorkflow: ['Physical furniture staging', 'Professional interior designer'],
        painPoints: [
          'Physical staging is expensive',
          'I cannot control the furniture',
          'Difficult to maintain a consistent design',
        ],
        currentSpending: '₹50,000–₹1,50,000 / month',
        currency: 'INR',
        featurePreferences: [
          'AI Virtual Staging',
          'Complete AI Interior Design',
          'Furniture Customization',
          'Material and Colour Selection',
          'Multiple Rooms Under One Property',
        ],
        topThreeFeatures: [
          'Complete AI Interior Design',
          'Furniture Customization',
          'Multiple Rooms Under One Property',
        ],
        wishlistFeature: 'Exact material texture matching for Italian marble & bouclé',
        purchaseIntent: 'Definitely would pay',
        preferredPricingModel: 'Package per property',
        priceExpectationPerRoom: '₹500–₹999',
        comfortablePriceNotes: 'Unlimited revisions during 48-hour client review window',
        earlyAccessInterest: 'Yes, definitely',
        interviewInterest: 'Yes',
        contactName: 'Kavita Chawla',
        contactEmail: `kavita_${Date.now()}@atelieroak.in`,
        contactPhone: '+91 98200 11223',
        marketingConsent: true,
      }
    );

    assert.strictEqual(res.statusCode, 201, `Feedback submission status ${res.statusCode}`);
    assert(res.json?.success === true, 'Feedback submission returned success');
    assert(res.json?.id, 'Feedback returned ID');
    logPass(`POST /api/v1/feedback saved customer validation record (ID: ${res.json.id})`);
  } catch (e) {
    logFail('POST /api/v1/feedback submission', e);
  }

  // 4. VERIFY FILE PERSISTENCE ON DISK
  console.log('\n--- 4. DIRECT DISK PERSISTENCE VERIFICATION ---');
  try {
    const waitlistPath = path.join(process.cwd(), 'data', 'waitlist.json');
    const feedbackPath = path.join(process.cwd(), 'data', 'feedback.json');

    assert(fs.existsSync(waitlistPath), 'data/waitlist.json exists');
    assert(fs.existsSync(feedbackPath), 'data/feedback.json exists');

    const waitlistData = JSON.parse(fs.readFileSync(waitlistPath, 'utf8'));
    const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));

    assert(waitlistData.length > 0, 'data/waitlist.json contains records');
    assert(feedbackData.length > 0, 'data/feedback.json contains records');

    logPass(`data/waitlist.json verified (${waitlistData.length} records)`);
    logPass(`data/feedback.json verified (${feedbackData.length} records)`);
  } catch (e) {
    logFail('Direct disk persistence check', e);
  }

  // 5. VALIDATION ANALYTICS SUMMARY ENDPOINT
  console.log('\n--- 5. ADMIN VALIDATION METRICS ---');
  try {
    const res = await req({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/admin/validation',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 200);
    assert(res.json?.metrics?.totalWaitlist >= 1, 'Total waitlist metric > 0');
    assert(res.json?.metrics?.totalFeedback >= 1, 'Total feedback metric > 0');
    logPass(`Validation metrics verified: ${res.json.metrics.totalWaitlist} waitlist, ${res.json.metrics.totalFeedback} feedback`);
  } catch (e) {
    logFail('GET /api/v1/admin/validation metrics', e);
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed.`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runTests();
