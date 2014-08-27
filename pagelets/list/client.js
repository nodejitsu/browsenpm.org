(function() {
  'use strict';

  function emit(pagelet) {
    setTimeout(function tick() {
      pipe.emit('list:initialize', pagelet);
    }, 0);
  }

  //
  // Re-emit events per pagelet name to the orginal list pagelet.
  // This is a temporary fix and as soon as BigPipe has improved
  // support for pagelet events this can be removed.
  //
  pipe.once('frameworks:initialize', emit);
  pipe.once('testing:initialize', emit);
})();