import React, { useState } from "react";
import useIsBrowser from '@docusaurus/useIsBrowser';

import IconThumbsUp from '@site/static/icons/thumbs-up.svg';
import IconThumbsDown from '@site/static/icons/thumbs-down.svg';
import Translate, { translate } from "@docusaurus/Translate";

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
        <Translate
          id="components.ReaderFeedback.ThankYou"
          description="Message to thank a reader for clicking a thumbsup/thumbdown button">
          Thanks for your feedback!
        </Translate>
      ) : (
        <>
          <Translate
            id="components.ReaderFeedback.Prompt"
            description="A prompt to invite the reader to click a thumbsup/thumbsdown button">
            Did you find this page helpful?
          </Translate>
          <IconThumbsUp
            className="feedback_thumbsup"
            alt={translate({
              message: "Like",
              id: "components.ReaderFeedback.ThumbsUp.Alt",
              description: "The alt value for the thumbsup icon"
            })}
            onClick={giveFeedback}
          />
          <IconThumbsDown
            className="feedback_thumbsdown"
            alt={translate({
              message: "Dislike",
              id: "components.ReaderFeedback.ThumbsDown.Alt",
              description: "The alt value for the thumbsdown icon"
            })}
            onClick={giveFeedback}
          />
        </>
      )}
    </div>
  );
};

export default ReaderFeedback;
