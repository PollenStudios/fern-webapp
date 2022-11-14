import TopProgressBar from '@badrap/bar-of-progress';

const ProgressBar = new TopProgressBar({
  // The size (height) of the progress bar.
  // Numeric values get converted to px.
  size: 2,

  // Color of the progress bar.
  // Also used for the glow around the bar.
  color: '#000',

  // Class name used for the progress bar element.
  className: 'bar-of-progress',

  // How many milliseconds to wait before the progress bar
  // animation starts after calling .start().
  delay: 100,
});
export default ProgressBar;
