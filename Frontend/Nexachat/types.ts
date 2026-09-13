import { createContext, ReactNode, RefObject } from "react";
import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { ImagePickerAsset } from "expo-image-picker";
import { Router } from "expo-router";

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children?: ReactNode;
  style?: TextStyle;
  textProps?: TextProps;
};

export interface UserProps {
  name: string;
  email: string;
  id?: string;
  avatar?: string | null;
}

export interface UserDataProps {
  name: string;
  email: string;
  avatar?: string | ImagePickerAsset | null;
}

export interface InputProps extends TextInputProps {
  icon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: RefObject<TextInput>;
}
export interface DecodedTokenProps {
  user: UserProps;
  exp: number; // expiration time
  iat: number; //issued time
}
export type AuthContextProps = {
  // const AuthContext = createContext<AuthContextProps>();
  token: string | null; //it will store login tokens
  user: UserProps | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    avatar?: string | null,
  ) => Promise<void>;
  signOut: () => Promise<void>;

  updateToken: (token: string) => Promise<void>;
};
export type ScreenWrapperProps = {
  style?: ViewStyle;
  children?: ReactNode;
  isModal?: Boolean;
  backgroundOpacity?: number;
  showPattren?: boolean;
};
export type ResponseProps = {
  success: boolean;
  data?: any;
  msg?: string;
};
export interface ButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress: () => void;
  loading?: boolean;
  children: ReactNode;
}
export type BackButtonProps = {
  style?: ViewStyle;
  color?: string;
  iconsize?: number;
    onPress?: () => void;
};
export type AvatarProps = {
  //Used for user profile pictures.
  size?: number;
  uri: string | null;
  isGroup?: boolean;
  style?: ViewStyle;
};
export type HeaderProps = {
  title?: string;
  showBackButton: boolean;
  rightElement: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
};

export type ConversationProps = {
  _id: string;
  type: "direct" | "group";
  avatar?: string | null;

  participants: {
    _id: string;
    name: string;
    avatar?: string | null;
    email: string;
  }[];

  name?: string;

  lastMessage: {
    _id: string;
    name: string;
    Content: string;
    SenderId: string;
    type?: "text" | "image" | "file";
    createdAt: string;
    attatchment: string;
  };
  createdAt: string;
  updatedAt: string;
};
export type ConversationListItemProps = {
  item: ConversationProps;
  showDivider: boolean;
  isGroup?: boolean;
  router: Router;
};
export type MessageProps = {
  _id: string;

  sender: {
    id: string;
    name: string;
    avatar?: string | null;
  };

  content: string;
  attachment?: string | null;
  createdAt: string;
};
export type ActivityIndicatorProps = {
  size: string;
  color: "string";
};
