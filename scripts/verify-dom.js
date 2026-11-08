const http = require('http');

async function testDom(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let html = '';
      res.on('data', (c) => (html += c));
      res.on('end', () => {
        console.log(`\n=== DOM CHECK: ${name} (${url}) ===`);
        console.log('  HTTP Status:', res.statusCode);
        console.log('  Document length:', html.length, 'characters');
        console.log('  Has DOCTYPE html:', html.includes('<!DOCTYPE html>'));
        console.log('  Has #showcase section:', html.includes('id="showcase"'));
        console.log('  Has Living Room pill:', html.includes('Living Room'));
        console.log('  Has Master Bedroom pill:', html.includes('Master Bedroom'));
        console.log('  Has Dining Room pill:', html.includes('Dining Room'));
        console.log('  Has Kitchen & Island pill:', html.includes('Kitchen &amp; Island') || html.includes('Kitchen & Island'));
        console.log('  Has showcase images:', html.includes('/showcase/living-before.jpg') && html.includes('/showcase/living-after.jpg'));
        console.log('  Has Waitlist elements:', html.includes('waitlist') || html.includes('Waitlist'));
        resolve();
      });
    });
  });
}

(async () => {
  await testDom('http://localhost:3000/', 'Landing Page');
  await testDom('http://localhost:3000/feedback', 'Feedback Questionnaire');
  await testDom('http://localhost:3000/feedback/thank-you', 'Thank You Page');
})();
