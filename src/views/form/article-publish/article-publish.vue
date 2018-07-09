<style lang="less">
@import '../../../styles/common.less';
@import './article-publish.less';
</style>

<template>
    <div>
        <Row>
            <Col span="18">
                <Card>
                    <Form :label-width="80">
                        <FormItem label="文章标题" :error="articleError">
                            <Input v-model="articleTitle" @on-blur="handleArticletitleBlur" icon="android-list"/>
                        </FormItem>
                        <div class="article-link-con">
                            <transition name="fixed-link">
                                <FormItem v-show="showLink" label="固定链接">
                                    <span>
                                        <span key="pathfixedtext">{{ fixedLink }}</span><span key="pathText" v-if="!editLink">{{ articlePath }}</span>
                                        <Input key="pathInput" v-model="articlePath" style="display:inline-block;width:auto"  v-else/>
                                    </span>
                                    <span style="float:right;">
                                        <Button :type="editPathButtonType" @click="editArticlePath">{{ editPathButtonText }}</Button>
                                    </span>
                                </FormItem>
                            </transition>
                        </div>
                    </Form>
                    <div class="margin-top-20">
                        <textarea id="articleEditor"></textarea>
                    </div>
                </Card>
            </Col>
            <Col span="6" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        发布
                    </p>
                    <p class="margin-top-10">
                        <Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：
                        <Select size="small" style="width:90px" value="草稿">
                            <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                        </Select>
                    </p>
                    <p class="margin-top-10">
                        <Icon type="eye"></Icon>&nbsp;&nbsp;公开度：&nbsp;<b>{{ Openness }}</b>
                        <Button v-show="!editOpenness" size="small" @click="handleEditOpenness" type="text">修改</Button>
                        <transition name="openness-con">
                            <div v-show="editOpenness" class="openness-radio-con">
                                <RadioGroup v-model="currentOpenness" vertical>
                                    <Radio label="公开">
                                        公开
                                        <Checkbox v-show="currentOpenness === '公开'" v-model="topArticle">在首页置顶这篇文章</Checkbox>
                                    </Radio>
                                    <Radio label="密码">
                                        密码
                                        <Input v-show="currentOpenness === '密码'" style="width:120px" size="small" placeholder="请输入密码"/>
                                    </Radio>
                                    <Radio label="私密"></Radio>
                                </RadioGroup>
                                <div>
                                    <Button type="primary" @click="handleSaveOpenness">确认</Button>
                                    <Button type="ghost" @click="cancelEditOpenness">取消</Button>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;
                        <span v-if="publishTimeType === 'immediately'">立即发布</span><span v-else>定时：{{ publishTime }}</span>
                        <Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>
                        <transition name="publish-time">
                            <div v-show="editPublishTime" class="publish-time-picker-con">
                                <div class="margin-top-10">
                                    <DatePicker @on-change="setPublishTime" type="datetime" style="width:200px;" placeholder="选择日期和时间" ></DatePicker>
                                </div>
                                <div class="margin-top-10">
                                    <Button type="primary" @click="handleSavePublishTime">确认</Button>
                                    <Button type="ghost" @click="cancelEditPublishTime">取消</Button>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <Row class="margin-top-20 publish-button-con">
                        <span class="publish-button"><Button @click="handlePreview">预览</Button></span>
                        <span class="publish-button"><Button @click="handleSaveDraft">保存草稿</Button></span>
                        <span class="publish-button"><Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button></span>
                        <Modal
                            v-model="modal1"
                            title="发布文章"
                            @on-ok="publishOk"
                            @on-cancel="publishCancel">
                            <p>确定发布该文章 ? </p>
                        </Modal>
                    </Row>
                </Card>
                <div class="margin-top-10">
                    <Card>
                        <p slot="title">
                            <Icon type="navicon-round"></Icon>
                            分类目录
                        </p>
                        <Tabs type="card">
                            <!-- <TabPane label="所有分类目录">
                                <div class="classification-con">
                                    <Tree :data="classificationList" @on-check-change="setClassificationInAll" show-checkbox></Tree>
                                </div>
                            </TabPane> -->
                            <TabPane label="常用目录">
                                <div class="classification-con">
                                    <RadioGroup v-model="offenUsedClassSelected" @on-change="setClassificationInOffen">
                                        <p v-for="item in offenUsedClass" :key="item.title">
                                            <Radio :label="item.value">{{ item.title }}</Radio>
                                        </p>
                                    </RadioGroup>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
                <div class="margin-top-10">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-pricetags-outline"></Icon>
                            标签
                        </p>
                        <Row>
                            <Col span="18">
                                <Select v-model="articleTagSelected" multiple @on-change="handleSelectTag" placeholder="请选择文章标签">
                                    <Option v-for="item in articleTagList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                                </Select>
                            </Col>
                            <Col span="6" class="padding-left-10">
                                <Button v-show="!addingNewTag" @click="handleAddNewTag" long type="ghost">新建</Button>
                            </Col>
                        </Row>
                        <transition name="add-new-tag">
                            <div v-show="addingNewTag" class="add-new-tag-con">
                                <Col span="14">
                                    <Input v-model="newTagName" placeholder="请输入标签名" />
                                </Col>
                                <Col span="5" class="padding-left-10">
                                    <Button @click="createNewTag" long type="primary">确定</Button>
                                </Col>
                                <Col span="5" class="padding-left-10">
                                    <Button @click="cancelCreateNewTag" long type="ghost">取消</Button>
                                </Col>
                            </div>
                        </transition>
                    </Card>
                </div>
                <div class="margin-top-10">
                    <Card>
                        <p slot="title">
                            <Icon type="navicon-round"></Icon>
                            语言
                        </p>
                        <RadioGroup v-model="languageSelected" type="button">
                            <Radio v-for="item in languages" :key="item.title" :label="item.value">{{ item.title }}</Radio>
                        </RadioGroup>
                        
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import tinymce from 'tinymce';
// import $ from 'jquery';
import Util from '@/libs/util';
import { setStore, getStore, removeStore } from '@/libs/myUtil';
import { baseUrl } from '@/config/index.js';

export default {
    name: 'artical-publish',
    data () {
        return {
            modal1: false,
            articleTitle: '',
            articleError: '',
            showLink: false,
            fixedLink: '',
            articlePath: '',
            articlePathHasEdited: false,
            editLink: false,
            editPathButtonType: 'ghost',
            editPathButtonText: '编辑',
            articleStateList: [{ value: '草稿' }, { value: '等待复审' }],
            editOpenness: false,
            Openness: '公开',
            currentOpenness: '公开',
            topArticle: false,
            publishTime: '',
            publishTimeType: 'immediately',
            editPublishTime: false, // 是否正在编辑发布时间
            articleTagSelected: [], // 文章选中的标签
            articleTagList: [], // 所有标签列表
            classificationList: [],
            classificationSelected: [], // 在所有分类目录中选中的目录数组
            offenUsedClass: [],
            offenUsedClassSelected: '1', // 常用目录选中的目录
            // offenUsedClassSelected: [], // 常用目录选中的目录
            classificationFinalSelected: '', // 最后实际选择的目录
            // classificationFinalSelected: [], // 最后实际选择的目录
            publishLoading: false,
            addingNewTag: false, // 添加新标签
            languages: [], // 语言
            languageSelected: '1', // 选择的语言
            newTagName: '' // 新建标签名
        };
    },
    methods: {
        /* getBody (content) {
            const REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
            const result = REG_BODY.exec(content);
            if (result && result.length === 2) { return result[1]; }
            return content;
        }, */
        publishOk () {
            if (this.canPublish()) {
                this.publishLoading = true;
                /* eslint-disable no-debugger */
                // debugger;
                Util.ajax.post('/api/v2/topics', {
                    title: this.articleTitle,
                    content: tinymce.activeEditor.getContent(),
                    create_time: `${+new Date()}`,
                    tag_list: JSON.stringify(this.articleTagSelected), // 标签
                    language: this.languageSelected || '2', // 语言
                    theme: this.classificationFinalSelected || '1' // 分类
                }).then(x => {
                    this.publishLoading = false;
                    this.$Notice.success({
                        title: '保存成功',
                        desc: '文章《' + this.articleTitle + '》保存成功'
                    });
                    removeStore('draft');

                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                });
            }
        },
        publishCancel () {
            this.$Message.info('Clicked cancel');
        },
        handleArticletitleBlur () {
            if (this.articleTitle.length !== 0) {
                // this.articleError = '';
                localStorage.articleTitle = this.articleTitle; // 本地存储文章标题
                if (!this.articlePathHasEdited) {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    this.fixedLink =
                        window.location.host +
                        '/' +
                        year +
                        '/' +
                        month +
                        '/' +
                        day +
                        '/';
                    this.articlePath = this.articleTitle;
                    this.articlePathHasEdited = true;
                    this.showLink = true;
                }
            } else {
                // this.articleError = '文章标题不可为空哦';
                this.$Message.error('文章标题不可为空哦');
            }
        },
        editArticlePath () {
            this.editLink = !this.editLink;
            this.editPathButtonType =
                this.editPathButtonType === 'ghost' ? 'success' : 'ghost';
            this.editPathButtonText =
                this.editPathButtonText === '编辑' ? '完成' : '编辑';
        },
        handleEditOpenness () {
            this.editOpenness = !this.editOpenness;
        },
        handleSaveOpenness () {
            this.Openness = this.currentOpenness;
            this.editOpenness = false;
        },
        cancelEditOpenness () {
            this.currentOpenness = this.Openness;
            this.editOpenness = false;
        },
        handleEditPublishTime () {
            this.editPublishTime = !this.editPublishTime;
        },
        handleSavePublishTime () {
            this.publishTimeType = 'timing';
            this.editPublishTime = false;
        },
        cancelEditPublishTime () {
            this.publishTimeType = 'immediately';
            this.editPublishTime = false;
        },
        setPublishTime (datetime) {
            this.publishTime = datetime;
        },
        setClassificationInAll (selectedArray) {
            this.classificationFinalSelected = selectedArray.map(item => {
                return item.title;
            });
            localStorage.classificationSelected = JSON.stringify(
                this.classificationFinalSelected
            ); // 本地存储所选目录列表
        },
        setClassificationInOffen (selectedArray) {
            this.classificationFinalSelected = selectedArray;
        },
        handleAddNewTag () {
            this.addingNewTag = !this.addingNewTag;
        },
        createNewTag () {
            if (this.newTagName.length !== 0) {
                this.articleTagList.push({ value: this.newTagName });
                this.addingNewTag = false;
                setTimeout(() => {
                    this.newTagName = '';
                }, 200);
            } else {
                this.$Message.error('请输入标签名');
            }
        },
        cancelCreateNewTag () {
            this.newTagName = '';
            this.addingNewTag = false;
        },
        canPublish () {
            if (this.articleTitle.length === 0) {
                this.$Message.error('请输入文章标题');
                return false;
            } else {
                return true;
            }
        },
        handlePreview () {
            if (this.canPublish()) {
                this.handleSaveDraft(null, 1);
                if (this.publishTimeType === 'immediately') {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    localStorage.publishTime =
                        year +
                        ' 年 ' +
                        month +
                        ' 月 ' +
                        day +
                        ' 日 -- ' +
                        hour +
                        ' : ' +
                        minute +
                        ' : ' +
                        second;
                } else {
                    localStorage.publishTime = this.publishTime; // 本地存储发布时间
                }

                this.$router.push({
                    name: 'preview'
                });
            }
        },
        handleSaveDraft (x, b) {
            // debugger;
            try {
                setStore('draft', '1');
                setStore('themeType', this.classificationFinalSelected || '1');
                setStore('content', tinymce.activeEditor.getContent());
                if (!b) {
                    this.$Message.success('草稿保存成功');
                }
            } catch (error) {
                this.$Message.error(error);
            }
        },
        handlePublish () {
            if (this.canPublish()) {
                this.modal1 = true;
            }
        },
        handleSelectTag () {
            localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
        }
    },
    computed: {
        completeUrl () {
            let finalUrl = this.fixedLink + this.articlePath;
            localStorage.finalUrl = finalUrl; // 本地存储完整文章路径
            return finalUrl;
        }
    },
    mounted () {
        this.articleTagList = [
            { value: '区块链' },
            { value: '初链' },
            { value: 'truechain' },
            { value: '央视' },
            { value: '去中心化' },
            { value: '混合共识' }
        ];
        this.classificationList = [
            {
                title: 'Vue实例',
                expand: true,
                children: [
                    {
                        title: '数据与方法',
                        expand: true
                    },
                    {
                        title: '生命周期',
                        expand: true
                    }
                ]
            },
            {
                title: 'Class与Style绑定',
                expand: true,
                children: [
                    {
                        title: '绑定HTML class',
                        expand: true,
                        children: [
                            {
                                title: '对象语法',
                                expand: true
                            },
                            {
                                title: '数组语法',
                                expand: true
                            },
                            {
                                title: '用在组件上',
                                expand: true
                            }
                        ]
                    },
                    {
                        title: '生命周期',
                        expand: true
                    }
                ]
            },
            {
                title: '模板语法',
                expand: true,
                children: [
                    {
                        title: '插值',
                        expand: true
                    },
                    {
                        title: '指令',
                        expand: true
                    },
                    {
                        title: '缩写',
                        expand: true
                    }
                ]
            }
        ];
        this.offenUsedClass = [
            {
                title: '技术动态',
                value: '1'
            },
            {
                title: '商业动态',
                value: '2'
            }
        ];
        this.languages = [
            {
                title: '中文',
                value: '1'
            },
            {
                title: '英文',
                value: '2'
            },
            {
                title: '韩文',
                value: '3'
            }
        ];
        tinymce.init({
            selector: '#articleEditor',
            branding: false,
            elementpath: false,
            height: 600,
            toolbar: 'fontsizeselect',
            remove_linebreaks: false,
            fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
            setup: function (ed) {
                ed.on('init', function () {
                    this.execCommand('fontName', false, 'tahoma');
                    this.execCommand('fontSize', false, '14px');
                });
            },
            images_upload_url: function (params) {
                // debugger;
            },
            images_upload_handler: (blobInfo, success, failure) => {
                let xhr, formData;
                const sizeLimit = 1024 * 1024 * 2;
                // var sizeLimit = 1024;
                if (blobInfo.blob().size > sizeLimit) {
                    failure('长传图片不能大于2M');
                } else {
                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                }
                xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', `${baseUrl}uploaad`);
                xhr.onload = function () {
                    if (xhr.status !== 200) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                    }
                    const { data } = JSON.parse(xhr.responseText);
                    tinymce.get('articleEditor').execCommand('mceInsertContent', false, `<img src="${data.imgSrc}" style="max-width: 650px; height: auto;"/>`);
                    success(data.location);
                };
                xhr.send(formData);
            },
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1:
                ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            },
            style_formats: [
                {
                    title: '首行缩进',
                    block: 'p',
                    styles: { 'text-indent': '2em' }
                },
                {
                    title: '行高',
                    items: [
                        {title: '1', styles: { 'line-height': '1' }, inline: 'span'},
                        {title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span'},
                        {title: '2', styles: { 'line-height': '2' }, inline: 'span'},
                        {title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span'},
                        {title: '3', styles: { 'line-height': '3' }, inline: 'span'}
                    ]
                }
            ]

        });
        if (getStore('draft') === '1') {
            const {
                articleTitle,
                content,
                tagsList,
                themeType
            } = window.localStorage;
            this.articleTitle = articleTitle;
            this.offenUsedClassSelected = themeType;
            if (tagsList) {
                this.articleTagSelected = JSON.parse(tagsList);
            }
            // const bodyValue = this.getBody(content);
            setTimeout(() => {
                tinymce.get('articleEditor').execCommand('mceInsertContent', false, content);
            }, 1000);
        }
    },
    destroyed () {
        tinymce.get('articleEditor').destroy();
    }
};
</script>
