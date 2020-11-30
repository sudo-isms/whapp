import * as React from 'react';

function Warning(props) {
  const [dismissed, setDismissed] = React.useState(false);
  const message = props.children || <>Couldn't connect to server. Try Again!</>;

  if (dismissed) {
    return null;
  }

  return (
    <div
      className="warning-bar"
      onClick={() => {
        setDismissed(true);
      }}
    >
      {message}
    </div>
  );
}

export default Warning;
