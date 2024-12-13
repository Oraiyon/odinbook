import { useEffect, useState } from "react";
import styles from "../stylesheets/ProfileHeader.module.css";
import Follows from "./Follows";

const ProfileHeader = (props) => {
  const [sentRequest, setSentRequest] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const [receivedRequest, setReceivedRequest] = useState(false);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const response = await fetch(`/api/${props.user.id}/following/${props.userProfile.id}`);
        const data = await response.json();
        if (data) {
          setAlreadyFollowing(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSentRequest = async () => {
      try {
        const response = await fetch(`/api/${props.user.id}/requests/${props.userProfile.id}`);
        const data = await response.json();
        if (data) {
          setSentRequest(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchReceivedRequest = async () => {
      try {
        const response = await fetch(`/api/${props.userProfile.id}/requests/${props.user.id}`);
        const data = await response.json();
        if (data) {
          setReceivedRequest(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (props.user) {
      fetchFollow();
      fetchSentRequest();
      fetchReceivedRequest();
    }
  }, []);

  const HandleRequestButton = (props) => {
    if (props.sentRequest) {
      return <button onClick={handleSentRequest}>Unsend Request</button>;
    } else {
      return <button onClick={handleSentRequest}>Follow</button>;
    }
  };

  const handleDeclineRequest = async (mode) => {
    try {
      let response;
      if (mode === "sender") {
        response = await fetch(`/api/delete/request/${props.user.id}/${props.userProfile.id}`, {
          method: "DELETE"
        });
      } else {
        response = await fetch(`/api/delete/request/${props.userProfile.id}/${props.user.id}`, {
          method: "DELETE"
        });
      }
      const data = await response.json();
      if (data) {
        setSentRequest(false);
        setReceivedRequest(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSentRequest = async () => {
    try {
      if (!sentRequest) {
        const response = await fetch("/api/create/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sender: props.user.id,
            receiver: props.userProfile.id
          })
        });
        const data = await response.json();
        if (data) {
          setSentRequest(true);
        }
      } else {
        handleDeclineRequest("sender");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Display BOTH request follow/unfollow button AND accept/decline request
  return (
    <header className={styles.header_container}>
      <div>
        <h1>{props.userProfile.username}</h1>
        <Follows followers={props.userProfile.FollowedBy} following={props.userProfile.Following} />
      </div>
      {props.user ? (
        <>
          {alreadyFollowing ? (
            <button>Unfollow</button>
          ) : (
            <HandleRequestButton sentRequest={sentRequest} />
          )}
          {receivedRequest ? (
            <div className={styles.request_buttons}>
              <button>Accept Request</button>
              <button onClick={() => handleDeclineRequest("receiver")}>Decline Request</button>
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </header>
  );
};

export default ProfileHeader;
