import Card from "components/card";
import { useStyletron } from "baseui";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { Alert } from "baseui/icon";
import { Button } from "baseui/button";
import { validate as validateEmail } from "email-validator";
import { useState, useEffect, useRef, FormEvent } from "react";
import { Spinner } from "baseui/spinner";
import {
  toaster,
  ToasterContainer,
  PLACEMENT
} from "baseui/toast";

const ErrorMessage = (): JSX.Element => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        paddingRight: theme.sizing.scale500,
        color: theme.colors.negative400,
      })}
    >
      <Alert size="18px" />
    </div>
  );
};

export default function Contact(): JSX.Element {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const [name, setName] = useState("");
  const nameIsValid = name.trim().length >= 2;
  const shouldShowNameError = !nameIsValid && hasAttemptedSubmit;

  const [email, setEmail] = useState("");
  const [emailIsVisited, setEmailIsVisited] = useState(false);
  const emailIsValid = validateEmail(email.trim());
  const shouldShowEmailError =
    email.trim().length > 0 && !emailIsValid && emailIsVisited;

  const [message, setMessage] = useState("");
  const messageIsValid = message.trim().length > 4;
  const shouldShowMessageError = !messageIsValid && hasAttemptedSubmit;

  const [answer, setAnswer] = useState("");
  const [hasSubmittedInvalidAnswer, setHasSubmittedInvalidAnswer] =
    useState(false);
  const answerIsValid = answer.trim().length > 1;
  const shouldShowAnswerError = !answerIsValid && hasSubmittedInvalidAnswer;

  const [challenge, setChallenge] = useState<null | string>(null);
  const [shouldShowCaptcha, setShouldShowCaptcha] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const submitDebounce = useRef<ReturnType<typeof setTimeout>>(null);

  const updateChallenge = async () => {
    const { challenge } = await (await fetch(`/api/challenge`)).json();
    setChallenge(challenge);
  };

  useEffect(() => {
    if (shouldShowCaptcha && !challenge) {
      updateChallenge();
    }
  }, [shouldShowCaptcha]);

  const onSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!isSending) {
      clearTimeout(submitDebounce.current);
      setIsSending(true);
      submitDebounce.current = setTimeout(async () => {
        if (nameIsValid && emailIsValid && messageIsValid) {
          if (shouldShowCaptcha && challenge) {
            await fetch(`/api/answer`, {
              method: "POST",
              body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                answer: answer.trim(),
              }),
            }).then(async (res) => {
              const { challenge, correct } = await res.json();
              if (correct) {
                toaster.positive(<><p className="m">Message sent.</p><p>Thanks for getting in touch!</p></>, {
                  // overrides: {InnerContainer: {style: {width: '100%'}}}
                });

                setHasAttemptedSubmit(false);
                setName("");
                setEmail("");
                setEmailIsVisited(false);
                setMessage("");
                setAnswer("");
                setHasSubmittedInvalidAnswer(false);
                setChallenge(null);
                setShouldShowCaptcha(false);
              } else {
                setChallenge(challenge);
                setAnswer("");
                setHasSubmittedInvalidAnswer(true);
              }
            });
          } else {
            setShouldShowCaptcha(true);
          }
        }
        setIsSending(false);
      }, 400);
    }
    setHasAttemptedSubmit(true);
  };

  return (
    <ToasterContainer placement={PLACEMENT.topRight} autoHideDuration={1000}>
      <Card>
        <form className="m" onSubmit={onSubmit}>
          <h1 className="h2 m">Get in contact</h1>
          <div className="m">
            <FormControl
              label="Your name"
              error={shouldShowNameError ? "Please input your name" : null}
            >
              <Input
                value={name}
                onChange={(event: FormEvent<HTMLInputElement>) => {
                  const { value } = event.target as EventTarget & {
                    value: string;
                  };
                  setName(value);
                }}
                error={shouldShowNameError}
                overrides={
                  shouldShowNameError
                    ? {
                        After: ErrorMessage,
                      }
                    : {}
                }
              />
            </FormControl>
            <FormControl
              label="Your email"
              error={
                shouldShowEmailError ? "Please input a valid email address" : null
              }
            >
              <Input
                value={email}
                onChange={(event: FormEvent<HTMLInputElement>) => {
                  const { value } = event.target as EventTarget & {
                    value: string;
                  };
                  setEmail(value);
                }}
                onBlur={() => setEmailIsVisited(true)}
                error={shouldShowEmailError}
                overrides={
                  shouldShowEmailError
                    ? {
                        After: ErrorMessage,
                      }
                    : {}
                }
              />
            </FormControl>
            <FormControl
              label="Your message"
              error={shouldShowMessageError ? "Please input a message" : null}
            >
              <Textarea
                value={message}
                onChange={(event: FormEvent<HTMLTextAreaElement>) => {
                  const { value } = event.target as EventTarget & {
                    value: string;
                  };
                  setMessage(value);
                }}
                error={shouldShowMessageError}
                overrides={
                  shouldShowMessageError
                    ? {
                        After: ErrorMessage,
                      }
                    : {}
                }
              />
            </FormControl>
          </div>
          {shouldShowCaptcha ? (
            <div className="m">
              {challenge === null ? (
                <Spinner />
              ) : (
                <div>
                  <FormControl
                    label={
                      <>
                        {challenge}
                        <a
                          className="link"
                          style={{
                            display: "inline-block",
                            marginLeft: 8,
                          }}
                          href="https://peasant.zone/tool/calculator"
                          target="_blank"
                          rel="noreferrer"
                        >
                          [Calculator]
                        </a>
                      </>
                    }
                    error={shouldShowAnswerError ? "Try again" : null}
                  >
                    <Input
                      value={answer}
                      onChange={(event: FormEvent<HTMLInputElement>) => {
                        const { value } = event.target as EventTarget & {
                          value: string;
                        };
                        setAnswer(value);
                      }}
                      error={shouldShowAnswerError}
                      overrides={
                        shouldShowAnswerError
                          ? {
                              After: ErrorMessage,
                            }
                          : {}
                      }
                    />
                  </FormControl>
                </div>
              )}
            </div>
          ) : null}
          <Button onClick={() => onSubmit()} loading={isSending} disabled={isSending}>
            Send
          </Button>
          <div tabIndex={-1} className="sr-only">
            <button type="submit">Send</button>
          </div>
        </form>
      </Card>
    </ToasterContainer>
  );
}
