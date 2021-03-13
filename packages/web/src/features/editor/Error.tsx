export default function Error({
  error,
  message,
}: {
  error: string;
  message: string;
}) {
  return (
    <div
      style={{
        border: '1px solid red',
        padding: '0.5rem 1rem',
        background: 'rgb(255, 240, 240)',
      }}
    >
      <p>{message}</p>
      <p>{error}</p>
    </div>
  );
}
