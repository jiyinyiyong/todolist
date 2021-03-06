
body#app
  #navbar (:class view-{{view}})
    .category.doing
      :v-on "click: view='doing'"
      span.count $ :v-model doing.length
      = doing
    .category.todo
      :v-on "click: view='todo'"
      span.count $ :v-model todo.length
      = todo
    .category.done
      :v-on "click: (view='done')"
      span.count $ :v-model done.length
      = done
    .category.add
      #add (:v-on "click: add()")
        :v-if "view != 'done'"
        = +
  #list (@partial doing.cirru)
    @partial todo.cirru
    @partial done.cirru