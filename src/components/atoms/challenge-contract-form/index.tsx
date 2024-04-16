import React, {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
} from "react";
import { SorobanEventsProvider } from "@soroban-react/events";
import BrowserOnly from "@docusaurus/BrowserOnly";
import styles from "./style.module.css";
import CompleteStepButton from "../complete-step-button";
import UserChallengesContext, {
  UserChallengesContextProps,
} from "../../../store/user-challenges-context";
import { getActiveChallenge } from "../../../utils/get-active-challenge";
import useAuth from "../../../hooks/useAuth";

interface ChallengeFormProps {
  id: number;
  address?: string;
}

function ChallengeContractForm({ address, id }: ChallengeFormProps) {
  const [savedContractId, setSavedContractId] = useState("");
  const [contractId, setContractId] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { data } = useContext<UserChallengesContextProps>(
    UserChallengesContext,
  );
  const isSubmitBtnDisabled = !contractId || savedContractId === contractId;

  useEffect(() => {
    if (address) {
      const challenge = getActiveChallenge(data, id);
      setSavedContractId(challenge?.contractId || "");
      setIsStarted(!!challenge?.startDate);
    }
  }, [address, savedContractId, data, id]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setContractId(event.target.value);
  };

  const blurHandler = () => {
    if (!contractId) {
      setFormError("Mandatory field");
    } else {
      setFormError(null);
    }
  };

  if (!isStarted) {
    return (
      <>
        <strong>
          Connect your wallet to track your progress and submit ContractId.
        </strong>
        <br />
      </>
    );
  }

  return (
    <div>
      {savedContractId ? (
        <p className={styles.success}>ContractId submitted!</p>
      ) : null}

      <form
        className={styles.challengeform}
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        <input
          className={
            formError
              ? `${styles.input} ${styles.inputWithError}`
              : styles.input
          }
          type="text"
          placeholder="Enter your ContractId"
          onChange={changeHandler}
          onBlur={blurHandler}
          required
        />

        <CompleteStepButton
          isDisabled={isSubmitBtnDisabled}
          type="submit"
          id={id}
          progress={1}
          contractId={contractId}
        >
          {savedContractId ? "Re-submit" : "Submit contractId"}
        </CompleteStepButton>
      </form>
      <span className={styles.errorMessage}>{formError}</span>
    </div>
  );
}

function InnerComponent({ id }: { id: number }) {
  const { loading, address } = useAuth();

  // if user is not logged in (address is undefined), render the Login button
  if (loading) {
    return (
      <div style={{ fontWeight: "bold" }}>
        Please connect to Testnet network.
        <br />
      </div>
    );
  }
  // if user is logged in and connected to the right network,
  // render the ChallengeForm
  return <ChallengeContractForm address={address} id={id} />;
}

export function ParentChallengeContractForm({ id }: { id: number }) {
  return (
    <SorobanEventsProvider>
      <BrowserOnly fallback={<div>Please connect to Testnet network.</div>}>
        {() => <InnerComponent id={id} />}
      </BrowserOnly>
    </SorobanEventsProvider>
  );
}
