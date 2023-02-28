export const SCALE = 'dataZoom';

export function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const msValue = Math.round(elapsed / 1000);
    return msValue === 1 ? `a second ago` : `${msValue} seconds ago`;
  }

  else if (elapsed < msPerHour) {
    const mnValue = Math.round(elapsed / msPerMinute);
    return mnValue === 1 ? `a minute ago` : `${mnValue} minutes ago`;
  }

  else if (elapsed < msPerDay) {
    const hValue = Math.round(elapsed / msPerHour);
    return hValue === 1 ? `a hour ago` : `${hValue} hours ago`;
  }

  else if (elapsed < msPerMonth) {
    const dayValue = Math.round(elapsed / msPerDay);
    return dayValue === 1 ? dayValue : `${dayValue} days ago`;
  }

  else if (elapsed < msPerYear) {
    const monthValue = Math.round(elapsed / msPerMonth);
    return monthValue === 1 ? `a month ago` : `${monthValue} months ago`;
  }
  else {
    const yearValue = Math.round(elapsed / msPerYear);
    return yearValue === 1 ? `a year ago` : `${yearValue} years ago`;
  }
}