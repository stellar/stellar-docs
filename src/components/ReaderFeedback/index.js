import React, { useState } from "react";
import useIsBrowser from '@docusaurus/useIsBrowser';

import IconThumbsUp from '@site/static/icons/thumbs-up.svg';
import IconThumbsDown from '@site/static/icons/thumbs-down.svg';

const ReaderFeedback = ({ pageId }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const isBrowser = useIsBrowser();
  if (!isBrowser) {
    return null;
  }

  const giveFeedback = (value) => {
    setFeedbackGiven(true);
  };

  return (
    <div className="readerFeedback">
      {feedbackGiven ? (
        'Thanks for your feedback!'
      ) : (
        <>
          Did you find this page helpful?
          <IconThumbsUp
            className="feedback_thumbsup"
            alt="Like"
            onClick={giveFeedback}
          />
          <IconThumbsDown
            className="feedback_thumbsdown"
            alt="Dislike"
            onClick={giveFeedback}
          />
        </>
      )}
    </div>
  );
};

export default ReaderFeedback;
