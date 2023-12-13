import { TextInput } from "@/components/basic/TextInput";
import styles from "./styles.module.scss";
import { Box, Grid, TextareaAutosize } from "@mui/material";
import { Image } from "@/components/basic/Image";
import { useLayoutEffect, useState } from "react";
import {
  getProfileService,
  updateProfileService,
} from "@/services/accountsService";
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AppButton } from "@/components/basic/AppButton";
import { TrashIcon } from "@/assets/icons/TrashIcon";
import {
  AWS_ROOT_MEDIA_URL,
  DARK_GRAY_400,
  DEFAULT_AVATAR_KEY,
  DEFAULT_HEADER_KEY,
  RED_E_APP_GREY_500,
} from "@/utils/constants";
import { getUserFromStorage, setAvatarStorage } from "@/utils/user";
import { When } from "react-if";
import { ImageEditor } from "@/components/dialogs/ImageEditor";
import { hideDialogReducer, setDialogContent } from "@/redux/dialog";
import { setAvatarUrlReducer } from "@/redux/users";
import { isDarkMode, showPrompt } from "@/utils/helpers";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prompt } from "@/components/dialogs/Prompt";
import { PartialPageLoader } from "@/components/basic/PartialPageLoader";
import { Avatar } from "@/components/basic/Avatar";

export function MyProfile() {
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [avatarKey, setAvatarKey] = useState(DEFAULT_AVATAR_KEY);
  const [headerKey, setHeaderKey] = useState(DEFAULT_HEADER_KEY);

  const [loaderVisible, setLoaderVisible] = useState(false);

  const user = getUserFromStorage();

  const auth = useAuth();
  const dispatch = useDispatch();
  const selectedNetwork = useSelector(
    (state: RootState) => state.networks.currentNetwork
  );
  const context = useSelector((state: RootState) => state.theme.currentTheme);

  async function uploadAvatar() {
    dispatch(
      setDialogContent(
        <ImageEditor
          type="avatar"
          sendBackImage={updateAvatar}
          currentKey={avatarKey}
        />
      )
    );
  }

  function updateHeader(key: string) {
    dispatch(hideDialogReducer());
    setHeaderKey(key);
  }

  function updateAvatar(key: string) {
    dispatch(hideDialogReducer());
    setAvatarKey(key);
  }

  async function uploadHeader() {
    dispatch(
      setDialogContent(
        <ImageEditor
          type="header"
          sendBackImage={updateHeader}
          currentKey={headerKey}
        />
      )
    );
  }

  async function clearHeader() {
    setHeaderKey(DEFAULT_HEADER_KEY);
  }
  async function clearAvatar() {
    setAvatarKey(DEFAULT_AVATAR_KEY);
  }

  async function getProfile() {
    setLoaderVisible(true);
    const profileSettings = await getProfileService(
      selectedNetwork.id,
      auth,
      dispatch
    );
    if (profileSettings.results.length) {
      const settings = profileSettings.results[0];
      setAvatarKey(settings.avatar_object_key);
      setHeaderKey(settings.background_object_key);
      setJob(settings.job_title);
      setLocation(settings.location);
      setBio(settings.bio);
    }
    setLoaderVisible(false);
  }

  async function updateProfile() {
    const payload = {
      avatar_object_key: avatarKey,
      background_object_key: headerKey,
      profile: {
        Bio: bio,
        "Job Title": job,
        Location: location,
        network_id: selectedNetwork.id,
      },
    };
    const updated = await updateProfileService(
      user.id,
      selectedNetwork.id,
      payload,
      auth,
      dispatch
    );
    if (updated) {
      showPrompt(
        dispatch,
        <Prompt
          promptText="Your profile has been updated!"
          confirmOnly
          confirmText="OK"
        />
      );
      setAvatarStorage(AWS_ROOT_MEDIA_URL + avatarKey);
      dispatch(setAvatarUrlReducer(AWS_ROOT_MEDIA_URL + avatarKey));
    }
  }

  useLayoutEffect(() => {
    getProfile();
  }, []);

  const iconColor = isDarkMode(context) ? DARK_GRAY_400 : RED_E_APP_GREY_500;

  const currentAvatarUrl = AWS_ROOT_MEDIA_URL + avatarKey;

  return (
    <Box
      className={`${styles.container} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <Box className={styles.content}>
        <Box className={styles.header}>
          <Box sx={{ padding: `10px` }}>
            <PageHeader text="Edit Profile" />
          </Box>
        </Box>
        <When condition={loaderVisible}>
          <Box>
            <PartialPageLoader visible={loaderVisible} />
          </Box>
        </When>
        <When condition={!loaderVisible}>
          <Box className={styles.body}>
            <Grid container>
              <Grid item xs={6} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>Avatar</Box>
                <Box>
                  <When condition={avatarKey}>
                    <Avatar
                      url={currentAvatarUrl}
                      name={user.name}
                      width={150}
                      height={150}
                      borderRadius={20}
                    />
                  </When>
                  <Box className={styles.actionItems}>
                    <AppButton
                      type="form"
                      onClick={uploadAvatar}
                      className={styles.changeButton}
                      label="Change Avatar"
                      size="small"
                    />
                    <Box className={styles.trashCan} onClick={clearAvatar}>
                      <TrashIcon color={iconColor} width={40} height={40} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={6} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>Header</Box>
                <When condition={headerKey}>
                  <Image
                    src={`${AWS_ROOT_MEDIA_URL}${headerKey}`}
                    width={`100%`}
                    maxWidth={`300px`}
                  ></Image>
                </When>
                <Box className={styles.actionItems}>
                  <AppButton
                    type="form"
                    onClick={uploadHeader}
                    className={styles.changeButton}
                    label="Change Header"
                    size="small"
                  />
                  <Box className={styles.trashCan} onClick={clearHeader}>
                    <TrashIcon color={iconColor} width={40} height={40} />
                  </Box>
                </Box>
              </Grid>
              <Grid item md={6} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>Job Title</Box>
                <Box>
                  <TextInput
                    type="form"
                    size="small"
                    textLength={100}
                    showLimitWarning
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item md={6} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>Location</Box>
                <Box>
                  <TextInput
                    type="form"
                    size="small"
                    value={location}
                    textLength={100}
                    showLimitWarning
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>Bio</Box>
                <Box>
                  <TextareaAutosize
                    maxLength={1000}
                    className={styles.bioInput}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} className={styles.fieldContainer}>
                <Box className={styles.fieldLabel}>
                  <AppButton
                    label="Update Profile"
                    type="form"
                    size="small"
                    onClick={updateProfile}
                    className={styles.changeButton}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </When>
      </Box>
    </Box>
  );
}
