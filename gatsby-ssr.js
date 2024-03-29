export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' });
  setHeadComponents([
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@umich-lib/css@1.0.9/dist/umich-lib.css" />,
    <script async type="text/javascript" src="https://umich.edu/apis/umalerts/umalerts.js"></script>
  ]);
};
