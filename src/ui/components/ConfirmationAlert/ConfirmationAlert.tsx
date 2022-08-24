import { SpinnerButton } from "../Button/SpinnerButton";
import styleSheet from "./ConfirmationAlert.module.css";

interface ConfirmationAlertProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ConfirmationAlert({
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationAlertProps) {
  return (
    <div className={styleSheet.container}>
      <p className={styleSheet.title}>Attention</p>
      <p>Voulez-vous vraiment supprimer ce pack?</p>
      <small>Cette action est irreversible</small>

      <div style={{ display: "flex", gap: "1em" }}>
        <SpinnerButton onClick={onCancel} type="error" text="Annuler" />
        <SpinnerButton
          isLoading={isLoading}
          onClick={onConfirm}
          text="Confirmer"
        />
      </div>
    </div>
  );
}
