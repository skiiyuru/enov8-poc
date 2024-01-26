import { useAuth, useUser } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { useEffect } from "react"
import { Button, H2, Text, XStack, YStack } from "tamagui"

export default function Profile() {
  const { signOut, isSignedIn } = useAuth()
  const { user } = useUser()

  return (
    <YStack gap="$4" padding={"$4"}>
      {isSignedIn ? (
        <>
          <YStack gap={"$2"}>
            <H2>Account</H2>
            <XStack>
              <Text color={"gray"}>Email: </Text>
              <Text fontWeight={"bold"}>
                {user?.emailAddresses[0].emailAddress}
              </Text>
            </XStack>
          </YStack>
          <XStack>
            <Button theme={"active"} onPress={() => signOut()}>
              Log out
            </Button>
          </XStack>
        </>
      ) : (
        <XStack>
          <Link href={"/(modals)/login"} asChild>
            <Button theme={"active"}>Log in</Button>
          </Link>
        </XStack>
      )}
    </YStack>
  )
}

/* 
{"backupCodeEnabled": false, 
"cachedSessionsWithActivities": null, 
"createBackupCode": [Function anonymous], 
"createEmailAddress": [Function anonymous], 
"createExternalAccount": [Function anonymous], 
"createOrganizationEnabled": true, 
"createPhoneNumber": [Function anonymous], 
"createTOTP": [Function anonymous], 
"createWeb3Wallet": [Function anonymous], 
"createdAt": 2024-01-26T09:20:45.549Z, 
"delete": [Function anonymous], 
"deleteSelfEnabled": true, 
"disableTOTP": [Function anonymous], 
"emailAddresses": [{"attemptVerification": [Function anonymous], 
"createEmailLinkFlow": [Function anonymous], 
"createMagicLinkFlow": [Function anonymous], 
"destroy": [Function anonymous], 
"emailAddress": "steveknganga@gmail.com", 
"id": "idn_2bUDXYilpPxBwFKO7St05LxyjFY", 
"linkedTo": [Array], 
"pathRoot": "/me/email_addresses", 
"prepareVerification": [Function anonymous], 
"toString": [Function anonymous], 
"verification": [ye]}], 
"externalAccounts": [], 
"externalId": null, 
"firstName": null, 
"fullName": null, 
"getOrganizationInvitations": [Function anonymous], 
"getOrganizationMemberships": [Function anonymous], 
"getOrganizationSuggestions": [Function anonymous], 
"getSessions": [Function anonymous], 
"hasImage": false, 
"id": "user_2bUDcnhvESTNO6orkRZ3CN7gW29", 
"imageUrl": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yYlU1WnRuWmUzWHVsa2V6T3BLekVZZ0ozTHAiLCJyaWQiOiJ1c2VyXzJiVURjbmh2RVNUTk82b3JrUlozQ043Z1cyOSJ9", 
"isPrimaryIdentification": [Function anonymous], 
"lastName": null, 
"lastSignInAt": 2024-01-26T09:45:39.731Z, 
"leaveOrganization": [Function anonymous], 
"organizationMemberships": [], 
"passwordEnabled": true, "
pathRoot": "/me", 
"phoneNumbers": [], 
"primaryEmailAddress": {"attemptVerification": [Function anonymous], 
"createEmailLinkFlow": [Function anonymous], "createMagicLinkFlow": [Function anonymous], "destroy": [Function anonymous], "emailAddress": "steveknganga@gmail.com", "id": "idn_2bUDXYilpPxBwFKO7St05LxyjFY", "linkedTo": [], "pathRoot": "/me/email_addresses", "prepareVerification": [Function anonymous], "toString": [Function anonymous], "verification": {"attempts": 1, "error": null, "expireAt": 2024-01-26T09:30:04.251Z, "externalVerificationRedirectURL": null, "nonce": null, "pathRoot": "", "status": "verified", "strategy": "email_code", "verifiedAtClient": undefined, "verifiedFromTheSameClient": [Function anonymous]}}, "primaryEmailAddressId": "idn_2bUDXYilpPxBwFKO7St05LxyjFY", "primaryPhoneNumber": null, "primaryPhoneNumberId": null, "primaryWeb3Wallet": null, "primaryWeb3WalletId": null, "publicMetadata": {}, "removePassword": [Function anonymous], "samlAccounts": [], "setProfileImage": [Function anonymous], "totpEnabled": false, "twoFactorEnabled": false, "unsafeMetadata": {}, "update": [Function anonymous], "updatePassword": [Function anonymous], "updatedAt": 2024-01-26T09:45:39.765Z, "username": null, "verifyTOTP": [Function anonymous], "web3Wallets": []}
*/
