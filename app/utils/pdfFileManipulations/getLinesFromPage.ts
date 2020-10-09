export const getLinesFromPage = async (page: any) => {
  let textContent = await page.getTextContent();
  var tempLine = '';
  var lines: string[] = [];
  var lastY = -1;
  textContent.items.forEach(function(i: any) {
    if (lastY != i.transform[5]) {
      lines.push(tempLine);
      tempLine = '';
      lastY = i.transform[5];
    }
    tempLine += i.str;
  });

  return lines;
};

export const getTextFromPage = async (page: any) => {
  let textContent = await page.getTextContent();
  var text = '';
  textContent.items.forEach(function(i: any) {
    text += i.str;
  });

  return text;
};
