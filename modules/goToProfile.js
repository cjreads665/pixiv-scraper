async function goToProfile(page,profileLink){
    await page.goto(profileLink);
    const el = await page.waitForSelector(
        "xpath///div[@role='button' and text()='Next']"
      );
}