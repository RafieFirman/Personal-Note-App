function RoutePlaceholder({ title, description }) {
  return (
    <section aria-labelledby="route-placeholder-title">
      <h2 id="route-placeholder-title">{title}</h2>
      <p>{description}</p>
    </section>
  );
}

export default RoutePlaceholder;
