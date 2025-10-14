import React, { useState } from 'react';
import {
  EuiCode,
  EuiGlobalToastList,
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
} from '@elastic/eui';

let addToastHandler;
let removeAllToastsHandler;
let toastId = 0;

export const addToast = (toast) => {

  addToastHandler(toast);
}

const removeAllToasts = () => {
  removeAllToastsHandler();
}

export default () => {
  const [toasts, setToasts] = useState([]);

  addToastHandler = ({title, color, text}) => {
    const toast = {title, color, text}
    // const toast = getRandomToast();
    setToasts(toasts.concat(toast));
  };

  const removeToast = (removedToast) => {
    setToasts((toasts) =>
      toasts.filter((toast) => toast.id !== removedToast.id)
    );
  };

  removeAllToastsHandler = () => {
    setToasts([]);
  };

  const getRandomToast = () => {
    const toasts = [
      {
        title:
          "Check it out, here's a really long title that will wrap within a narrower browser",
        text: (
          <>
            <p>
              Here&rsquo;s some stuff that you need to know. We can make this
              text really long so that, when viewed within a browser
              that&rsquo;s fairly narrow, it will wrap, too.
            </p>
            <p>
              And some other stuff on another line, just for kicks. And{' '}
              <EuiLink href="#">here&rsquo;s a link</EuiLink>.
            </p>
          </>
        ),
      },
      {
        title: 'Download complete!',
        color: 'success',
        text: <p>Thanks for your patience!</p>,
      },
      {
        title: 'Logging you out soon, due to inactivity',
        color: 'warning',
        iconType: 'user',
        text: (
          <>
            <p>This is a security measure.</p>
            <p>
              Please move your mouse to show that you&rsquo;re still using
              Kibana.
            </p>
          </>
        ),
      },
      {
        title: 'Oops, there was an error',
        color: 'danger',
        iconType: 'help',
        text: <p>Sorry. We&rsquo;ll try not to let it happen it again.</p>,
      },
      {
        title: 'Long toast',
        color: 'warning',
        iconType: 'clock',
        toastLifeTimeMs: 15000,
        text: (
          <p>
            This toast overrides the default <EuiCode>toastLifeTimeMs</EuiCode>{' '}
            value and will be around for 15 seconds.
          </p>
        ),
      },
    ];

    return {
      id: `toast${toastId++}`,
      ...toasts[Math.floor(Math.random() * toasts.length)],
    };
  };

  return (
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
  );
};