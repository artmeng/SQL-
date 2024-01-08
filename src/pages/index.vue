<template>
  <div>
    <div class="head">
      <div style="display: flex;justify-content: space-between; align-items: center;">
        <div>SQL之父</div>
        <el-image style="width: 40px; height: 40px" src="https://pic.imgdb.cn/item/6579acc2c458853aef0675b3.jpg"
          :fit="fit"></el-image>
      </div>
      <el-divider></el-divider>
    </div>

    <div class="muban">
      <el-input type="textarea" :rows="12" placeholder="请输入内容" v-model="mysql">
      </el-input>
    </div>

    <div class="change">
      <!-- 方法名 -->
      <div class="item">
        <div class="titile">
          方法名(非必填):
        </div><el-input class="my-input" v-model="name" placeholder="方法名(非必选)"></el-input>
      </div>

      <!-- 返回值类型 -->
      <div class="item">
        <div class="titile">
          返回值类型(非必填):
        </div><el-input class="my-input" v-model="type" placeholder="返回值类型(非必选)"></el-input>
      </div>

      <!-- 请求路径 -->
      <div class="item">
        <div class="titile">
          请求路径(非必填):
        </div><el-input class="my-input" v-model="path" placeholder="请求路径(非必选)"></el-input>
      </div>

      <!-- 参数类型 -->
      <div class="item">
        <div class="titile">
          参数类型(非必填):
        </div><el-input class="my-input" v-model="params" placeholder="对象名或Map集合"></el-input>
      </div>
    </div>

    <div class="change">


      <!-- 类名 -->
      <div class="item">
        <div class="titile">
          类名(非必填):
        </div><el-input class="my-input" v-model="className" placeholder="类名(非必填)"></el-input>
      </div>

      <!-- sql语句类型 -->
      <div class="item">
        <div class="titile">
          sql类型:
        </div>
        <el-select class="my-input" v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <!-- 请求类型 -->
      <div class="item">
        <div class="titile">
          请求类型:
        </div>
        <el-select class="my-input" v-model="value2" placeholder="请选择">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="item">
        <el-button type="primary" @click="convert">转化</el-button>
      </div>

      <div class="item">
        <el-tooltip class="item" effect="dark" placement="right">
          <template slot="content">
            <div v-html="remind">
            </div>
          </template>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </div>

    </div>
    <div class="flex">
      <div class="left">
        <div>domain:</div>
        <el-input type="textarea" :rows="14" v-model="domain">
        </el-input>
      </div>

      <div class="left">
        <div>controll:</div>
        <el-input type="textarea" :rows="14" v-model="controll">
        </el-input>
      </div>

      <div class="left">
        <div>impl:</div>
        <el-input type="textarea" :rows="14" v-model="impl">
        </el-input>
      </div>



    </div>

    <div class="flex">
      <div class="left">
        <div>service:</div>
        <el-input type="textarea" :rows="14" v-model="service">
        </el-input>
      </div>

      <div class="left">
        <div>mapper:</div>
        <el-input type="textarea" :rows="14" v-model="mapper">
        </el-input>
      </div>



      <div class="left">
        <div>sql:</div>
        <el-input type="textarea" :rows="14" v-model="sql">
        </el-input>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      path: '',
      name: '',
      type: '',
      mysql: '',
      domain: '',
      impl: '',
      service: '',
      paramsName: '',
      controll: '',
      mapper: '',
      sql: '',
      className: '',
      params: '',
      remind: '',
      value2: '',
      options: [{
        value: 'select',
        label: 'select语句'
      }, {
        value: 'update',
        label: 'update语句'
      }, {
        value: 'insert',
        label: 'insert语句'
      }, {
        value: 'delete',
        label: 'delete语句'
      }],
      options2: [{
        value: '@GetMapping',
        label: 'GET'
      }, {
        value: '@PostMapping',
        label: 'POST'
      }, {
        value: '@PutMapping',
        label: 'PUT'
      }, {
        value: '@DeleteMapping',
        label: 'DELETE'
      }],
      value: '',
      myArr: []
    }
  },
  mounted() {
    this.myArr = []
    this.remind = `
    格式要求：</br>
    正确示例：</br>
    topic_id      int auto_increment  primary key comment '作者',</br>
    author_id  int                                  not null comment '作者',</br>
    topic_title   varchar(50)                          not null comment '标题'</br>
    每个属性为一行，且必须要有comment注解。</br>
  </br>
    错误示例（单个属性不在一行）：</br>
    topic_id      int auto_increment  primary</br>
     key comment '作者',</br>
    </br>
    错误示例（无comment注解）：</br>
    topic_id      int auto_increment  primary  key,</br>
    `
  },
  methods: {
    convert() {
      this.domain = ''
      this.impl = ''
      this.sql = ''
      this.mapper = ''
      this.controll = ''
      this.service = ''
      this.myArr = []
      //先转domain语句
      this.toDomain()
      //转Impl层
      this.toImpl()
      //转sql
      this.toSql()
      if (this.name.trim() != '' && this.type.trim() != "") {
        this.toMapper()
        this.toService()
        this.toControll()
      }
    },
    toDomain() {
      if (this.className.trim() != '') {
        this.domain += `class ${this.className}{\n`
      }
      // 匹配属性名和类型的正则表达式
      const regex = /(\w+)\s+(\w+)(\([\s\S]*?\))?\s*(not\s+null)?\s*default\s*([^,\n]+)?\s*(null)?\s*comment\s*'([^']+)'(,|\n|$)/g;


      // 存储提取的属性名和类型
      const lines = this.mysql.split("\n")
      for (let line of lines) {
        line = line.trim();
        const match = line.match(/(\w+)\s+(\w+).*comment\s*'([^']+)',?/);

        if (match) {
          const propertyName = match[1];
          const propertyType = match[2];
          if (propertyName && propertyName.trim() != "")
            this.myArr.push(propertyName)
          this.domain += `private ${this.convertToJavaType(propertyType)} ${this.toCamelCase(propertyName)}; \n`
        }
      }
      if (this.className.trim() != '') {
        this.domain += `}\n`
      }
    },
    toImpl() {
      let s = ""
      this.impl += `public ${this.type} ${this.name}(${this.params} params){\n`
      let strArr = this.domain.split("\n")
      for (let str of strArr) {
        let newArr = str.split(/[\s;]+/)
        if (newArr.length > 2) {
          this.impl += `${newArr[1]} ${newArr[2]} = params.get${this.capitalizeFirstLetter(newArr[2])}();\n`
          s += this.toCamelCase(newArr[2]) + ","
        }

      }
      s = s.substring(0, s.length - 1)
      this.impl += '//你的处理逻辑\n'
      this.impl += `//${s}\n`
      this.impl += '}\n'
    },
    toSql() {
      //获取表名
      let tableName = this.extractTableName(this.mysql)
      if (tableName == null) {
        tableName = '你的表名'
      }
      let size = this.myArr.length
      if (this.value == "select") {
        this.sql = 'SELECT ';
        for (let i = 0; i < size; i++) {
          if (i != size - 1) {
            this.sql += this.myArr[i] + ','
          }
          else {
            this.sql += this.myArr[i]
          }
        }
        // => select a,b,c

        this.sql += "\n from " + tableName + "\n"
        // => select a,b,c from tableName
        this.sql += '<where>\n'
        // => select a,b,c 
        // from tableName
        // <where>
        for (let str of this.myArr) {
          this.sql += `<if test="${this.toCamelCase(str)}!=null and ${this.toCamelCase(str)}!=''">\n and ${str}=#{${this.toCamelCase(str)}}\n</if>\n`
        }
        this.sql += '</where>\n'
        // => select a,b,c 
        // from tableName
        // <where>
        // <if test="a!=null and a!=''">
        // a=#{a}
        // </if>
        console.log(this.sql);
      }
      else if (this.value == "update") {
        this.sql = `UPDATE ${tableName} \n<set>\n`
        for (let str of this.myArr) {
          this.sql += `<if test="${this.toCamelCase(str)}!=null and ${this.toCamelCase(str)}!=''">\n${str}=#{${this.toCamelCase(str)}},\n</if>\n`
        }
        this.sql += '</set>\n where 条件语句'
      }
      else if (this.value == "insert") {
        this.sql = `INSERT INTO ${tableName} ( \n<trim prefix="" suffix="" suffixOverrides=",">\n`
        for (let str of this.myArr) {
          this.sql += `<if test="${this.toCamelCase(str)}!=null and ${this.toCamelCase(str)}!=''">\n${str},\n</if>\n`
        }
        this.sql += '</trim>\n)\n'
        this.sql += 'VALUES (\n<trim prefix="" suffix="" suffixOverrides=",">\n'
        for (let str of this.myArr) {
          this.sql += `<if test="${this.toCamelCase(str)}!=null and ${this.toCamelCase(str)}!=''">\n#{${this.toCamelCase(str)}},\n</if>\n`
        }
        this.sql += '</trim>\n)\n'
      }
      else if (this.value == "delete") {
        this.sql = `DELETE FROM ${tableName} \n`
        this.sql += '<where>\n'
        for (let str of this.myArr) {
          this.sql += `<if test="${this.toCamelCase(str)}!=null and ${this.toCamelCase(str)}!=''">\n and ${str}=#{${this.toCamelCase(str)}}\n</if>\n`
        }
        this.sql += '</where>\n'
      }
    },
    toMapper() {
      this.mapper = `public ${this.type} ${this.name}(`
      let strArr = this.domain.split("\n")
      for (let str of strArr) {
        let newArr = str.split(/[\s;]+/)
        if (newArr.length >= 4)
          this.mapper += `@Param("${this.toCamelCase(newArr[2])}") ${newArr[1]} ${newArr[2]},`
      }
      //去除最后一个逗号
      this.mapper = this.mapper.substring(0, this.mapper.length - 1)
      this.mapper += ");"
    },
    toService() {
      this.service = `public ${this.type} ${this.name}(${this.params} params);`
    },
    toControll() {
      if (this.value2 != '' && this.path.trim() != '') {
        this.controll = `${this.value2}("${this.path}")\n`
        this.controll += `public Result ${this.name}(`
        if (this.value2 == '@PostMapping' || this.value2 == '@PutMapping') {
          this.controll += '@RequestBody '
        }
        this.controll += `${this.params} params){\n`
        this.controll += `//你的处理逻辑\n`
        this.controll += 'return null;\n}'
      }

    },
    // 辅助函数，将数据库类型转化为 Java 类型
    convertToJavaType(dbType) {
      switch (dbType.toLowerCase()) {
        case 'int':
          return 'Integer';
        case 'varchar':
          return 'String';
        case 'text':
          return 'String';
        case 'longtext':
          return 'String';
        case 'tinyint':
          return 'Boolean';
        case 'datetime':
          return 'LocalDateTime';
        case 'char':
          return 'Character';
        default:
          return dbType;
      }
    },
    //把_后第一个字母大写
    toCamelCase(inputString) {
      return inputString.replace(/_([a-z])/g, function (match, group) {
        return group.toUpperCase();
      });
    },
    // 第一个字母大写
    capitalizeFirstLetter(inputString) {
      return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    },
    // 匹配表名
    extractTableName(sqlStatements) {
      const match = sqlStatements.match(/create\s+table\s+(\w+)/i);

      if (match) {
        return match[1];
      }

      return null; // Return null if no match is found
    }

  }
}
</script>

<style scoped>
.muban {
  margin: 0 auto;
  width: 500px;
}

.change {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex {
  margin: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}


.left {
  flex: 1;
  margin: 0 15px;
}

.item {
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item .titile {
  padding-right: 8px;
}

.my-input {
  width: 155px;
}

.head {
  font-size: 25px;
  font-weight: 800;
  padding: 0 20px;
}

.head /deep/ .el-divider--horizontal {
  margin: 10px 0;
}
</style>