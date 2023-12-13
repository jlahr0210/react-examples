import { TextInput } from "@/components/basic/TextInput";
import styles from "./styles.module.scss";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { AppButton } from "@/components/basic/AppButton";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { When } from "react-if";
import { updatePasswordService } from "@/services/accountsService";
import { getUserFromStorage } from "@/utils/user";
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { isDarkMode, showPrompt } from "@/utils/helpers";
import { PageHeader } from "@/components/ui/PageHeader";
import { RootState } from "@/redux/store";
import { Prompt } from "@/components/dialogs/Prompt";

export function ChangePassword() {
  const user = getUserFromStorage();
  const auth = useAuth();
  const dispatch = useDispatch();
  const context = useSelector((state: RootState) => state.theme.currentTheme);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updateDisabled, setUpdateDisabled] = useState(false);

  async function updatePassword() {
    const passwordChange = await updatePasswordService(
      user.user.id,
      currentPassword,
      newPassword,
      auth,
      dispatch
    );
    if (passwordChange) {
      setCurrentPassword("");
      setNewPassword("");
      setNewConfirmPassword("");

      showPrompt(
        dispatch,
        <Prompt
          promptText="Your password has been successfully changed!"
          confirmOnly
          confirmText="OK"
        />
      );
    }
  }

  function validatePassword() {
    setError(null);
    setUpdateDisabled(false);

    const passwordCheck = zxcvbn(newPassword || "");
    setPasswordStrength(passwordCheck.score);
    setSuggestions(passwordCheck.feedback.suggestions);

    if (
      currentPassword.length === 0 &&
      newPassword.length === 0 &&
      newConfirmPassword.length === 0
    ) {
      // no need to display an error if they have not entered anything
      setUpdateDisabled(true);
      setError(null);
      setSuggestions([]);
      return;
    }

    if (currentPassword.length === 0) {
      setUpdateDisabled(true);
      setError("Please enter your current password!");
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setUpdateDisabled(true);
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 10) {
      setUpdateDisabled(true);
      setError("Password need to be at least 10 characters long");
      return;
    }
  }
  useEffect(() => {
    validatePassword();
  }, [newPassword, newConfirmPassword, currentPassword]);
  return (
    <Box
      className={`${styles.container} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <Box className={styles.content}>
        <Box className={styles.header}>
          <Box sx={{ padding: `10px` }}>
            <PageHeader text="Change Password" />
          </Box>
        </Box>
        <Box className={styles.body}>
          <Grid container>
            <Grid item xs={12} className={styles.fieldContainer}>
              <Box className={styles.fieldLabel}>Current Password</Box>
              <Box>
                <TextInput
                  password
                  type="form"
                  size="small"
                  textLength={150}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} className={styles.fieldContainer}>
              <Box className={styles.fieldLabel}>New Password</Box>
              <Box>
                <TextInput
                  password
                  type="form"
                  size="small"
                  textLength={150}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} className={styles.fieldContainer}>
              <Box className={styles.fieldLabel}>Confirm Password</Box>
              <Box>
                <TextInput
                  password
                  type="form"
                  size="small"
                  textLength={150}
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                />
              </Box>
            </Grid>

            <When condition={error}>
              <Grid item xs={12} className={styles.fieldContainer}>
                <Box className={styles.error}>{error}</Box>
              </Grid>
            </When>
            <When condition={newPassword.length}>
              <Grid item xs={12} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>Password Strength</Box>
                <Box>
                  <PasswordStrength
                    passwordStrength={passwordStrength}
                    suggestions={suggestions}
                  />
                </Box>
              </Grid>
            </When>

            <Grid item xs={12} className={styles.fieldContainer}>
              <Box className={styles.fieldLabel}>
                <AppButton
                  label="Update Password"
                  type="form"
                  size="small"
                  onClick={updatePassword}
                  className={styles.updateButton}
                  disabled={updateDisabled}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
