import usePermissions from "../../hooks/usePermissions";

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}) {
  const { can } =
    usePermissions();

  if (!can(permission)) {
    return fallback;
  }

  return children;
}