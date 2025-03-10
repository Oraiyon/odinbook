import styles from "../stylesheets/DeleteModal.module.css";
import DisplayProfilePicture from "./DisplayProfilePicture";

const DeleteModal = (props) => {
  const deleteUser = async () => {
    try {
      const response = await fetch(`/api/user/delete/${props.user.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (props.displayDeleteModal) {
    return (
      <div className={styles.delete_modal} onClick={() => props.setDisplayDeleteModal(false)}>
        <div className={styles.delete_user} onClick={(e) => e.stopPropagation()}>
          <div>
            <DisplayProfilePicture user={props.user} />
            <p>{props.user.username}</p>
          </div>
          <p>Confirm Deletion Of Account</p>
          <button onClick={deleteUser}>Delete Account</button>
        </div>
      </div>
    );
  }
};

export default DeleteModal;
