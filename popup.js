function setVerificationText(options) 
{
  options = options || {};
  const no_info = 'No information on current page verification status.';
  const el = document.getElementById('verification-text');
  let html = '<table><tr>';
  if(options.url)
    html += `<td>URL: </td><td>${options.url}</td>`;
  else
    html += `<td colspan='2'>${no_info}</td>`;
  html += '</tr><tr>';
  if(options.state === 'pass')
    html += `<td>STATE: </td><td>Current content matches recorded content and from a valid publisher</td>`;
  else if(options.state === 'fail')
    html += `<td>STATE: </td><td>Content does not match current state!</td>`;
  else
    html += `<td>STATE: </td><td>No Rakonto transaction found</td>`;
  html += '</tr></table>';
  console.log(html);
  el.innerHTML = html;
}


setInterval(() =>
{
  chrome.storage.local.get(['url','state'], function (result)
  {
    setVerificationText(result);
  });
}, 1000);

window.onload = (e) => 
{
  chrome.storage.local.get(['url','state'], function (result)
  {
    setVerificationText(result);
  });
};
