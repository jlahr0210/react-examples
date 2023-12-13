import styles from "./styles.module.scss";
import { SidebarProps } from "./types";
import { Box } from "@mui/material";
import { SidebarItemList } from "@/components/ui/SidebarItemList";
import { MessageIcon } from "@/assets/icons/MessageIcon";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { SettingsIcon } from "@/assets/icons/SettingsIcon";
import { NetworkSelector } from "@/components/ui/NetworkSelector";
import { BroadcastIcon } from "@/assets/icons/BroadcastIcon";
import { UserInfoCard } from "@/components/ui/UserInfoCard";
import { getSelectedNetworkFromStorage } from "@/utils/networks";
import { setCurrentNetwork } from "@/redux/networks";
import { SidebarItemProps } from "@/components/ui/SidebarItem/types";
import { ResourcesIcon } from "@/assets/icons/ResourcesIcon";
import { ShiftsIcon } from "@/assets/icons/ShiftsIcon";
import { AppHubIcon } from "@/assets/icons/AppHubIcon";
import { SendIcon } from "@/assets/icons/SendIcon";
import { DraftIcon } from "@/assets/icons/DraftIcon";
import { SendScheduledIcon } from "@/assets/icons/SendScheduledIcon";
import { NewSelect } from "@/components/ui/NewSelect";
import { BroadcastComposer } from "@/components/ui/BroadcastComposer";
import { hasShifts, isDarkMode, routerUrl } from "@/utils/helpers";
import { DARK_GRAY_200, RED_E_APP_GREY_700 } from "@/utils/constants";
import { CommunitiesIcon } from "@/assets/icons/CommunitiesIcon";
import { When } from "react-if";

export function Sidebar({ toggleCollapse, windowWidth }: SidebarProps) {
  const dispatch = useDispatch();
  const context = useSelector((state: RootState) => state.theme.currentTheme);

  const iconColor = isDarkMode(context) ? DARK_GRAY_200 : RED_E_APP_GREY_700;

  const collapsed = useSelector(
    (state: RootState) => state.sidebar.sidebarCollapsed
  );

  let selectedNetwork = useSelector(
    (state: RootState) => state.networks.currentNetwork
  );

  const unreadMessages = useSelector(
    (state: RootState) => state.badges.messageUnreadCount
  );

  const unreadReceivedBroadcasts = useSelector(
    (state: RootState) => state.badges.receivedBroadcastCount
  );

  const unreadSentBroadcasts = useSelector(
    (state: RootState) => state.badges.sentBroadcastCount
  );

  const canSendBroadcast = useSelector(
    (state: RootState) => state.networks.canSendBroadcasts
  );

  if (!selectedNetwork.id) {
    //pull from local storage as fallback and also update STORE
    selectedNetwork = getSelectedNetworkFromStorage();
    if (selectedNetwork.id) {
      dispatch(setCurrentNetwork(selectedNetwork));
    }
  }

  const sidebarItems: SidebarItemProps[] = [
    {
      label: "Messages",
      icon: <MessageIcon color={iconColor} />,
      link: routerUrl("messages"),
      collapsed: collapsed,
      unreadMessagesCount: unreadMessages,
    },
    {
      label: "Broadcasts",
      icon: <BroadcastIcon color={iconColor} />,
      link: routerUrl("broadcasts"),
      collapsed: collapsed,
      unreadMessagesCount: unreadReceivedBroadcasts,
      subMenuItems: canSendBroadcast
        ? [
            {
              label: "Sent",
              icon: <SendIcon color={iconColor} />,
              link: routerUrl("broadcasts/sent"),
              collapsed: collapsed,
              unreadMessagesCount: unreadSentBroadcasts,
            },
            {
              label: "Drafts",
              icon: <DraftIcon color={iconColor} />,
              link: routerUrl("broadcasts/drafts"),
              collapsed: collapsed,
            },
            {
              label: "Scheduled",
              icon: <SendScheduledIcon color={iconColor} />,
              link: routerUrl("broadcasts/scheduled"),
              collapsed: collapsed,
            },
          ]
        : [],
    },

    {
      label: "Resources",
      icon: <ResourcesIcon color={iconColor} />,
      link: routerUrl("resources"),
      collapsed: collapsed,
    },
  ];

  /* {
    label: "Communities",
    icon: <CommunitiesIcon color={iconColor} />,
    link: routerUrl("communities"),
    collapsed: collapsed,
  }, */

  //shifts require specific criteria
  if (hasShifts(selectedNetwork)) {
    sidebarItems.push({
      label: "Shifts",
      icon: <ShiftsIcon color={iconColor} />,
      link: routerUrl("shifts"),
      collapsed: collapsed,
    });
  }

  //app links should only appear if user has more than one

  sidebarItems.push(
    {
      label: "App Hub",
      icon: <AppHubIcon color={iconColor} />,
      link: routerUrl("apphub"),
      collapsed: collapsed,
    },
    {
      label: "Settings",
      icon: <SettingsIcon color={iconColor} />,
      link: routerUrl("settings"),
      collapsed: collapsed,
    }
  );

  return (
    <Box className={`${styles.menu} ${isDarkMode(context) && styles.darkMode}`}>
      <nav className={styles.nav}>
        <Box className={styles.networkSelectorContainer}>
          <NetworkSelector collapsed={collapsed} />
        </Box>
        <When condition={!collapsed}>
          <NewSelect />
        </When>
        <SidebarItemList
          windowWidth={windowWidth}
          toggleCollapse={toggleCollapse}
          items={sidebarItems}
        />
      </nav>

      <Box className={styles.userCard}>
        <UserInfoCard collapsed={collapsed} />
      </Box>
      <BroadcastComposer />
    </Box>
  );
}
