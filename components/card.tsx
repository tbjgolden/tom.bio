const Card = ({ children, style = {}, ...props }: { children: React.ReactNode, style?: CSSProperties }) => {
  return (
    <div style={{
      border: "2px solid #ccc",
      padding: "16px 16px 0",
      ...style
    }} {...props}>
      {children}
    </div>
  )
}

export default Card
