<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, value } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      const titleValue = value ? `(${value})` : ''
      vnodes.push(<span slot='title'>{(title)}<span style='margin-left: 10px; color: red'>{(titleValue)}</span></span>)
    }
    return vnodes
  }
}
</script>
