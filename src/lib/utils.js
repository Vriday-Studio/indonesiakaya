export const timeFormat = (locale, time, isDetail = true, customOptions) => {
  const date = new Date(time);
  date.setHours(date.getHours());

  const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      ...(isDetail && {
          hour: 'numeric', 
          minute: 'numeric',
          timeZone: 'Asia/Jakarta',
          timeZoneName: 'short'
      })
  };

  const selectedOptions = customOptions || options
  return date.toLocaleDateString(locale, selectedOptions);
}

export const filterStringFromHtmlTag = (inputString) => {
  if (!inputString) return '';
  return inputString.replace(/(<([^>]+)>)/gi, "");
};