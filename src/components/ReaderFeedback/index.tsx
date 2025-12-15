import React, { useState, type ReactNode } from "react";
import useIsBrowser from '@docusaurus/useIsBrowser';

import IconThumbsUp from '@site/static/icons/thumbs-up.svg';
import IconThumbsDown from '@site/static/icons/thumbs-down.svg';
import Translate, { translate } from "@docusaurus/Translate";

export default function ReaderFeedback(): ReactNode {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const isBrowser = useIsBrowser();
  if (!isBrowser) {
    return null;
  }

  const giveFeedback = () => {
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
            title={translate({
              message: "Like",
              id: "components.ReaderFeedback.ThumbsUp.Title",
              description: "The title value for the thumbsup icon"
            })}
            onClick={giveFeedback}
          />
          <IconThumbsDown
            className="feedback_thumbsdown"
            title={translate({
              message: "Dislike",
              id: "components.ReaderFeedback.ThumbsDown.Title",
              description: "The title value for the thumbsdown icon"
            })}
            onClick={giveFeedback}
          />
        </>
      )}
    </div>
  );
};
