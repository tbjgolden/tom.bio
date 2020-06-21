export default function Avatar({ name, picture }) {
  return (
    <div>
      <img src={picture.url} alt={name} />
      <div>{name}</div>
    </div>
  );
}
