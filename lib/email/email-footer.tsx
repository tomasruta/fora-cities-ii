import { Text, Hr } from "@react-email/components";

export default function EmailFooter() {
  return (
    <>
      <Hr className="my-5 border-gray-600" />
      <Text className={"text-md text-gray-700"}>Fora Cities</Text>
    </>
  );
}

// Shouldnt expose our incorporation info for most transactional emails
export function EmailFooterForaAddress() {
  return (
    <Text className={"text-xs text-gray-600"}>
      1111b S Governors Avenue STE 7236 Dover, DE 19904 US
    </Text>
  );
}
