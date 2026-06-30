import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'siteContent.json');

export function getSiteData() {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading site data:", error);
    return null;
  }
}

export function saveSiteData(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error saving site data:", error);
    return false;
  }
}
