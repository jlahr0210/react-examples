import styles from "./styles.module.scss";
import { LayoutProps } from "../types";
import { Box, Grid } from "@mui/material";
import { Sidebar } from "../Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  SB_COLLAPSE_WIDTH,
  SB_WIDTH_COLLAPSED,
  SB_WIDTH_EXPANDED,
} from "@/utils/constants";
import { useState, useRef, useEffect } from "react";
import {
  collapseSidebar,
  expandSidebar,
  toggleSidebarCollapsed,
} from "@/redux/sidebar";
import { DialogBox } from "@/components/basic/DialogBox";
import { useWindowSize } from "@/hooks/useWindowSize";
import useAuth from "@/hooks/useAuth";
import {
  getBadgeCounts,
  getShiftCanAnnounce,
  isDarkMode,
} from "@/utils/helpers";
import { setCanAnnounce } from "@/redux/networks";

export function LayoutMain({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const lastApiRef = useRef(0);
  const auth = useAuth();
  const [windowWidth] = useWindowSize();
  const collapsed = useSelector(
    (state: RootState) => state.sidebar.sidebarCollapsed
  );

  lastApiRef.current = useSelector(
    (state: RootState) => state.refresh.lastRecordedApiTime
  );

  const selectedNetwork = useSelector(
    (state: RootState) => state.networks.currentNetwork
  );

  const [sidebarSpace, setSidebarSpace] = useState(
    collapsed ? SB_WIDTH_COLLAPSED : SB_WIDTH_EXPANDED
  );

  const context = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    if (windowWidth < SB_COLLAPSE_WIDTH) {
      if (collapsed) return;
      dispatch(collapseSidebar());
      setSidebarSpace(SB_WIDTH_COLLAPSED);
    } else {
      if (!collapsed) return;
      dispatch(expandSidebar());
      setSidebarSpace(SB_WIDTH_EXPANDED);
    }
  }, [windowWidth]);

  async function getBadgeDetails() {
    await getBadgeCounts(auth, dispatch, selectedNetwork);
  }

  async function checkCanAnnounce() {
    const canAnnounce = await getShiftCanAnnounce(
      auth,
      dispatch,
      selectedNetwork
    );
    dispatch(setCanAnnounce(canAnnounce));
  }

  useEffect(() => {
    if (selectedNetwork && selectedNetwork.id) {
      getBadgeDetails();
      checkCanAnnounce();
    }
  }, [selectedNetwork]);

  function onToggleCollapse() {
    const newSidebarSpace = !collapsed ? SB_WIDTH_COLLAPSED : SB_WIDTH_EXPANDED;
    setSidebarSpace(newSidebarSpace);

    dispatch(toggleSidebarCollapsed());
  }

  return (
    <Box
      className={`${styles.fullHeight} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <DialogBox />
      <Grid className={styles.fullHeight} container>
        <Grid width={sidebarSpace}>
          <Sidebar
            toggleCollapse={onToggleCollapse}
            windowWidth={windowWidth}
          />
        </Grid>
        <Grid
          width={`calc(100% - ${sidebarSpace}px)`}
          className={styles.fullHeight}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
