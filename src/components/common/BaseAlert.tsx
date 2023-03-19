import {
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
  AlertStatus,
} from '@chakra-ui/react';

type BaseAlertPropsType = {
  open: boolean;
  title: string;
  description?: string;
  type: AlertStatus;
  onClose: (open: boolean) => void;
};
export default function BaseAlert(props: BaseAlertPropsType) {
  return props.open ? (
    <Alert status={props.type}>
      <AlertIcon />
      <Box>
        <AlertTitle>{props.title}</AlertTitle>
        <AlertDescription>{props.description}</AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-end"
        onClick={() => {
          props.onClose(false);
        }}
      />
    </Alert>
  ) : (
    <></>
  );
}
