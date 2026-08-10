import usePermissions from "../../hooks/usePermissions";

export default function ProtectedAction({
  permission,
  children,
  onClick,
  ...props
}) {
  const { can } =
    usePermissions();

  const allowed =
    can(permission);

  const handleClick = (
    event
  ) => {
    if (!allowed) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      disabled={
        props.disabled ||
        !allowed
      }
      onClick={handleClick}
    >
      {children}
    </button>
  );
}