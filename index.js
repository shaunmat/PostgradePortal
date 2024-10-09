import { Builder, By, until } from 'selenium-webdriver';

// Replace with your LambdaTest credentials
const username = process.env.LT_USERNAME; 
const accessKey = process.env.LT_ACCESS_KEY;

const capability = {
  "browserName": "Chrome",
  "browserVersion": "129",
  "LT:Options": {
    "username": username,
    "accessKey": accessKey,
    "geoLocation": "ZA",
    "visual": true,
    "video": true,
    "platformName": "Windows 10",
    "build": "PGP",
    "project": "Untitled",
    "name": "Full Web App Test",
    "console": "warn",
    "w3c": true,
    "plugin": "node_js-node_js"
  }
};

const gridUrl = `https://${username}:${accessKey}@hub.lambdatest.com/wd/hub`;

async function testViteReactApp() {
  let driver = await new Builder().usingServer(gridUrl).withCapabilities(capability).build();

  try {
    // Access the deployed Vite-React app
    await driver.get('https://shaunmat.github.io/PostGradePortal/');

    // Wait for the page to load
    await driver.wait(until.titleIs('PostGrade Portal'), 20000); // Increased timeout
    console.log('Page loaded successfully!');

    // Debug: Log the current title
    const currentTitle = await driver.getTitle();
    console.log('Current Title:', currentTitle);

    // Login functionality
    const emailField = await driver.findElement(By.id('email'));
    const passwordField = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.id('login'));

    // Enter email and password
    await emailField.sendKeys('221000001@student.uj.ac.za');
    await passwordField.sendKeys('abcd1234');
    
    // Click the login button
    await loginButton.click();

    // Wait for the dashboard or the next page to load after login
    await driver.wait(until.titleIs('Dashboard'), 20000); // Increase timeout if necessary

    // Verify successful login
    let heading = await driver.findElement(By.tagName('h1')).getText();
    console.log('Heading found after login:', heading);

    // Perform assertions based on expected heading or content
    if (heading === 'Expected Heading After Login') {
      console.log('Login test passed!');
      await driver.executeScript('lambda-status=passed');
    } else {
      console.log('Login test failed!');
      await driver.executeScript('lambda-status=failed');
    }

  } catch (err) {
    console.log('Error:', err);
    await driver.executeScript('lambda-status=failed');
  } finally {
    await driver.quit();
  }
}

testViteReactApp();
