import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [activeModule, setActiveModule] = useState('command')
  const [activeSubModule, setActiveSubModule] = useState(null)
  const [subModuleData, setSubModuleData] = useState(null)
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: '你好！我是SoloOS的AI助手，有什么可以帮助你的吗？'
    }
  ])
  const [aiInput, setAiInput] = useState('')
  const chatMessagesRef = useRef(null)
  const [integrations, setIntegrations] = useState([
    { id: 'notion', name: 'Notion', description: '文档协作工具', status: 'pending', buttonText: '连接' },
    { id: 'wechat', name: '微信', description: '客户沟通工具', status: 'pending', buttonText: '连接' },
    { id: 'stripe', name: 'Stripe', description: '支付处理工具', status: 'pending', buttonText: '连接' },
    { id: 'google-calendar', name: 'Google Calendar', description: '日历管理工具', status: 'pending', buttonText: '连接' },
    { id: 'flow-club', name: 'Flow Club', description: '专注协作工具', status: 'pending', buttonText: '连接' },
    { id: 'alipay', name: '支付宝', description: '支付平台', status: 'pending', buttonText: '连接' },
    { id: 'bank', name: '银行流水', description: '财务数据', status: 'pending', buttonText: '连接' }
  ])

  const handleSubModuleOpen = (subModule, data = null) => {
    setActiveSubModule(subModule)
    setSubModuleData(data)
  }

  const handleSubModuleClose = () => {
    setActiveSubModule(null)
    setSubModuleData(null)
  }

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [aiMessages])

  // 处理API连接
  const handleIntegrationConnect = (integrationId) => {
    // 首先更新状态为连接中
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connecting', buttonText: '连接中...' } 
        : integration
    ))
    
    // 模拟连接过程
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'active', buttonText: '已连接' } 
          : integration
      ))
    }, 2000)
  }

  // 处理API断开连接
  const handleIntegrationDisconnect = (integrationId) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'pending', buttonText: '连接' } 
        : integration
    ))
  }

  const handleAiMessageSend = () => {
    if (aiInput.trim() === '') return
    
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: aiInput
    }
    
    setAiMessages(prev => [...prev, newMessage])
    setAiInput('')
    
    // 模拟AI回复
    setTimeout(() => {
      const aiReply = getAiResponse(aiInput)
      const replyMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiReply
      }
      setAiMessages(prev => [...prev, replyMessage])
    }, 1000)
  }

  const handleQuickQuestionClick = (question) => {
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: question
    }
    
    setAiMessages(prev => [...prev, newMessage])
    
    // 模拟AI回复
    setTimeout(() => {
      const aiReply = getAiResponse(question)
      const replyMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiReply
      }
      setAiMessages(prev => [...prev, replyMessage])
    }, 1000)
  }

  const getAiResponse = (question) => {
    const responses = {
      '今天有什么待办事项？': '根据您的日程安排，今天有2个待处理事项：1. 完成项目A的设计稿（10:00 AM）；2. 与客户B通话（2:00 PM）。',
      '如何添加新客户？': '您可以通过以下步骤添加新客户：1. 点击"客户中心"；2. 点击"智能客户管理"卡片；3. 在数据录入部分填写客户信息；4. 点击"添加客户"按钮。',
      '查看本月财务报表': '本月财务概览：收入¥15,000，支出¥8,000，利润¥7,000。您可以在"财务中心"的"实时财务数据"中查看详细报表。',
      '启动专注模式': '您可以通过以下步骤启动专注模式：1. 点击"指令中心"；2. 点击"深度工作守护"卡片；3. 选择专注时长；4. 点击"开始专注"按钮。',
      '如何添加任务？': '您可以通过以下步骤添加任务：1. 点击"指令中心"；2. 点击"智能日程管理"卡片；3. 在数据录入部分填写任务信息；4. 点击"添加任务"按钮。',
      '如何管理预算？': '您可以通过"财务中心"的"智能预算管理"功能来管理预算，包括添加预算、查看预算使用情况和接收预算警告。',
      '如何添加营销渠道？': '您可以通过"增长引擎"的"营销渠道管理"功能来添加和管理营销渠道，包括内容端、社群端、媒体端和设计端。',
      '如何设置API集成？': '您可以在"设置"中的"API集成管理"部分连接各种工具，如Notion、微信、Stripe和Google Calendar。'
    }
    
    // 关键词匹配
    if (question.includes('待办') || question.includes('任务')) {
      return '根据您的日程安排，今天有2个待处理事项：1. 完成项目A的设计稿（10:00 AM）；2. 与客户B通话（2:00 PM）。'
    }
    if (question.includes('客户')) {
      return '您可以通过"客户中心"的"智能客户管理"功能添加和管理客户信息，包括客户画像和分类管理。'
    }
    if (question.includes('财务') || question.includes('报表')) {
      return '本月财务概览：收入¥15,000，支出¥8,000，利润¥7,000。您可以在"财务中心"查看详细报表。'
    }
    if (question.includes('专注') || question.includes('工作')) {
      return '您可以通过"指令中心"的"深度工作守护"功能启动专注模式，屏蔽通知，提高工作效率。'
    }
    if (question.includes('预算')) {
      return '您可以通过"财务中心"的"智能预算管理"功能来管理预算，包括添加预算和查看预算使用情况。'
    }
    if (question.includes('营销') || question.includes('渠道')) {
      return '您可以通过"增长引擎"的"营销渠道管理"功能来添加和管理营销渠道，AI会自动识别高效渠道。'
    }
    if (question.includes('设置') || question.includes('API')) {
      return '您可以在"设置"中管理个人信息、系统设置和API集成，支持连接Notion、微信、Stripe等工具。'
    }
    
    // 默认回复
    return '感谢您的问题！我是SoloOS的AI助手，为您提供智能支持。您可以询问关于日程管理、客户管理、财务管理或营销渠道的问题，我会为您提供详细的解答。'
  }

  const renderModule = () => {
    if (activeSubModule) {
      return <SubModule 
        subModule={activeSubModule} 
        data={subModuleData} 
        onClose={handleSubModuleClose}
        aiMessages={aiMessages}
        aiInput={aiInput}
        setAiInput={setAiInput}
        handleAiMessageSend={handleAiMessageSend}
        handleQuickQuestionClick={handleQuickQuestionClick}
        chatMessagesRef={chatMessagesRef}
        integrations={integrations}
        handleIntegrationConnect={handleIntegrationConnect}
        handleIntegrationDisconnect={handleIntegrationDisconnect}
      />
    }

    switch (activeModule) {
      case 'command':
        return <CommandCenter onSubModuleOpen={handleSubModuleOpen} />
      case 'client':
        return <ClientHub onSubModuleOpen={handleSubModuleOpen} />
      case 'cfo':
        return <AutoCFO onSubModuleOpen={handleSubModuleOpen} />
      case 'growth':
        return <GrowthEngine onSubModuleOpen={handleSubModuleOpen} />
      default:
        return <CommandCenter onSubModuleOpen={handleSubModuleOpen} />
    }
  }

  return (
    <div className="app">
      {/* 侧边栏导航 */}
      <aside className="sidebar">
        <div className="logo">
          <h1>SoloOS</h1>
          <p>一人公司操作系统</p>
        </div>
        <nav className="nav">
          <NavItem 
            icon="⚡" 
            label="指令中心" 
            active={activeModule === 'command'} 
            onClick={() => { setActiveModule('command'); setActiveSubModule(null); }} 
          />
          <NavItem 
            icon="👥" 
            label="客户中心" 
            active={activeModule === 'client'} 
            onClick={() => { setActiveModule('client'); setActiveSubModule(null); }} 
          />
          <NavItem 
            icon="💰" 
            label="财务中心" 
            active={activeModule === 'cfo'} 
            onClick={() => { setActiveModule('cfo'); setActiveSubModule(null); }} 
          />
          <NavItem 
            icon="🚀" 
            label="增长引擎" 
            active={activeModule === 'growth'} 
            onClick={() => { setActiveModule('growth'); setActiveSubModule(null); }} 
          />
        </nav>
        <div className="user">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <p>用户</p>
            <p className="user-role">管理员</p>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="main">
        <header className="header">
          <h2>{getModuleTitle(activeModule)}</h2>
          <div className="header-actions">
            <button className="btn" onClick={() => handleSubModuleOpen('schedule')}>
              <span>📅</span>
              日程
            </button>
            <button className="btn" onClick={() => handleSubModuleOpen('ai-assistant')}>
              <span>🤖</span>
              AI助手
            </button>
            <button className="btn" onClick={() => handleSubModuleOpen('settings')}>
              <span>⚙️</span>
              设置
            </button>
          </div>
        </header>
        
        {/* 快捷操作面板 */}
        {!activeSubModule && (
          <div className="quick-actions">
            <h3>快捷操作</h3>
            <div className="quick-actions-grid">
              <QuickAction 
                icon="➕" 
                label="添加任务" 
                onClick={() => handleSubModuleOpen('schedule')} 
              />
              <QuickAction 
                icon="👥" 
                label="添加客户" 
                onClick={() => handleSubModuleOpen('clients')} 
              />
              <QuickAction 
                icon="💰" 
                label="添加财务记录" 
                onClick={() => handleSubModuleOpen('reports')} 
              />
              <QuickAction 
                icon="🚀" 
                label="添加营销渠道" 
                onClick={() => handleSubModuleOpen('channels')} 
              />
              <QuickAction 
                icon="🎯" 
                label="启动专注" 
                onClick={() => handleSubModuleOpen('focus')} 
              />
              <QuickAction 
                icon="📊" 
                label="查看报表" 
                onClick={() => handleSubModuleOpen('reports')} 
              />
            </div>
          </div>
        )}
        
        <div className="content">
          {renderModule()}
        </div>
      </main>
    </div>
  )
}

// 导航项组件
function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  )
}

// 快捷操作组件
function QuickAction({ icon, label, onClick }) {
  return (
    <button className="quick-action-btn" onClick={onClick}>
      <span className="quick-action-icon">{icon}</span>
      <span className="quick-action-label">{label}</span>
    </button>
  )
}

// 指令中心模块
function CommandCenter({ onSubModuleOpen }) {
  return (
    <div className="module">
      <div className="module-header">
        <h3>指令中心</h3>
        <p>统一管理分散的应用窗口和任务流程</p>
      </div>
      <div className="module-content">
        <div className="card">
          <h4>智能日程管理</h4>
          <p>今日工作 ¥3,200，待处理事项 2 个，项目 A 进度 80%</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('schedule')}
          >
            查看详情
          </button>
        </div>
        <div className="card">
          <h4>深度工作守护</h4>
          <p>一键进入专注模式，屏蔽通知，提高工作效率</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('focus')}
          >
            启动专注
          </button>
        </div>
        <div className="card">
          <h4>健康度监测</h4>
          <p>连续工作 2 小时，建议休息 10 分钟</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('health')}
          >
            查看数据
          </button>
        </div>
      </div>
    </div>
  )
}

// 客户中心模块
function ClientHub({ onSubModuleOpen }) {
  return (
    <div className="module">
      <div className="module-header">
        <h3>客户中心</h3>
        <p>获客与客户智能管理</p>
      </div>
      <div className="module-content">
        <div className="card">
          <h4>智能客户管理</h4>
          <p>管理多渠道客户，AI 生成客户画像</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('clients')}
          >
            查看客户
          </button>
        </div>
        <div className="card">
          <h4>订单管理系统</h4>
          <p>整合多平台订单数据，智能定价</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('orders')}
          >
            查看订单
          </button>
        </div>
        <div className="card">
          <h4>团队协作管理</h4>
          <p>任务分配与数据同步，客户沟通提醒</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('team')}
          >
            查看团队
          </button>
        </div>
      </div>
    </div>
  )
}

// 财务中心模块
function AutoCFO({ onSubModuleOpen }) {
  return (
    <div className="module">
      <div className="module-header">
        <h3>财务中心</h3>
        <p>实时管理与预测</p>
      </div>
      <div className="module-content">
        <div className="card">
          <h4>实时财务数据</h4>
          <p>自动抓取多平台数据，生成财务报表</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('reports')}
          >
            查看报表
          </button>
        </div>
        <div className="card">
          <h4>智能预算管理</h4>
          <p>生成智能预算，预算使用警告</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('budget')}
          >
            查看预算
          </button>
        </div>
        <div className="card">
          <h4>财务与税务智能</h4>
          <p>自动整理凭证，智能税务申报</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('tax')}
          >
            查看税务
          </button>
        </div>
      </div>
    </div>
  )
}

// 增长引擎模块
function GrowthEngine({ onSubModuleOpen }) {
  return (
    <div className="module">
      <div className="module-header">
        <h3>增长引擎</h3>
        <p>驱动业务与产品</p>
      </div>
      <div className="module-content">
        <div className="card">
          <h4>营销渠道管理</h4>
          <p>多平台数据采集，AI 识别高效渠道</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('channels')}
          >
            查看渠道
          </button>
        </div>
        <div className="card">
          <h4>产品服务包管理</h4>
          <p>将服务打包为标准化产品</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('products')}
          >
            查看产品
          </button>
        </div>
        <div className="card">
          <h4>知识内容管理</h4>
          <p>自动整理知识库，可复用内容库</p>
          <button 
            className="btn-primary"
            onClick={() => onSubModuleOpen('knowledge')}
          >
            查看知识
          </button>
        </div>
      </div>
    </div>
  )
}

// 辅助函数：获取模块标题
function getModuleTitle(module) {
  const titles = {
    command: '指令中心 - 个人操作中枢',
    client: '客户中心 - 获客与客户智能',
    cfo: '财务中心 - 实时管理与预测',
    growth: '增长引擎 - 驱动业务与产品'
  }
  return titles[module] || '指令中心'
}

// 子模块组件
function SubModule({ subModule, data, onClose, aiMessages, aiInput, setAiInput, handleAiMessageSend, handleQuickQuestionClick, chatMessagesRef, integrations, handleIntegrationConnect, handleIntegrationDisconnect }) {
  const renderSubModuleContent = () => {
    switch (subModule) {
      // 指令中心子模块
      case 'schedule':
        return (
          <div className="sub-module-content">
            <h3>智能日程管理</h3>
            <div className="section">
              <h4>今日概览</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-value">¥3,200</p>
                  <p className="stat-label">今日工作</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">2</p>
                  <p className="stat-label">待处理事项</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">80%</p>
                  <p className="stat-label">项目 A 进度</p>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>待处理事项</h4>
              <div className="task-list">
                <div className="task-item">
                  <input type="checkbox" />
                  <div className="task-content">
                    <p>完成项目 A 的设计稿</p>
                    <p className="task-time">10:00 AM</p>
                  </div>
                </div>
                <div className="task-item">
                  <input type="checkbox" />
                  <div className="task-content">
                    <p>与客户 B 通话</p>
                    <p className="task-time">2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>任务名称</label>
                  <input type="text" placeholder="输入任务名称" />
                </div>
                <div className="form-group">
                  <label>时间</label>
                  <input type="datetime-local" />
                </div>
                <div className="form-group">
                  <label>优先级</label>
                  <select>
                    <option>高</option>
                    <option>中</option>
                    <option>低</option>
                  </select>
                </div>
                <button className="btn-primary">添加任务</button>
              </div>
            </div>
          </div>
        )
      case 'focus':
        return (
          <div className="sub-module-content">
            <h3>深度工作守护</h3>
            <div className="section">
              <h4>专注模式设置</h4>
              <div className="focus-settings">
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>屏蔽通知</label>
                </div>
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>暂停非紧急任务提醒</label>
                </div>
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>调整状态为勿扰</label>
                </div>
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>启动工具限流</label>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>专注时长</h4>
              <div className="duration-selector">
                <button className="duration-btn">25分钟</button>
                <button className="duration-btn">45分钟</button>
                <button className="duration-btn">60分钟</button>
                <button className="duration-btn">自定义</button>
              </div>
            </div>
            <div className="section">
              <h4>启动专注</h4>
              <button className="btn-primary btn-large">
                <span>🎯</span>
                开始专注
              </button>
            </div>
          </div>
        )
      case 'health':
        return (
          <div className="sub-module-content">
            <h3>健康度监测</h3>
            <div className="section">
              <h4>今日数据</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-value">2小时</p>
                  <p className="stat-label">连续工作</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">10分钟</p>
                  <p className="stat-label">建议休息</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">8/10</p>
                  <p className="stat-label">健康评分</p>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>周趋势</h4>
              <div className="chart-placeholder">
                <p>📊 工作时长趋势图</p>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>休息时间</label>
                  <input type="time" />
                </div>
                <div className="form-group">
                  <label>健康状态</label>
                  <select>
                    <option>良好</option>
                    <option>一般</option>
                    <option>疲劳</option>
                  </select>
                </div>
                <button className="btn-primary">更新数据</button>
              </div>
            </div>
          </div>
        )
      
      // 客户中心子模块
      case 'clients':
        return (
          <div className="sub-module-content">
            <h3>智能客户管理</h3>
            <div className="section">
              <h4>客户列表</h4>
              <div className="client-list">
                <div className="client-item">
                  <div className="client-avatar">A</div>
                  <div className="client-info">
                    <h5>客户 A</h5>
                    <p>项目 A 客户</p>
                    <p className="client-meta">
                      <span>联系电话: 138****1234</span>
                      <span>邮箱: clientA@example.com</span>
                    </p>
                    <p className="client-tags">
                      <span className="tag">网站设计</span>
                      <span className="tag">长期合作</span>
                    </p>
                  </div>
                  <div className="client-status">
                    <span className="status-badge active">活跃</span>
                    <div className="client-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="client-item">
                  <div className="client-avatar">B</div>
                  <div className="client-info">
                    <h5>客户 B</h5>
                    <p>潜在客户</p>
                    <p className="client-meta">
                      <span>联系电话: 139****5678</span>
                      <span>邮箱: clientB@example.com</span>
                    </p>
                    <p className="client-tags">
                      <span className="tag">品牌设计</span>
                      <span className="tag">新客户</span>
                    </p>
                  </div>
                  <div className="client-status">
                    <span className="status-badge pending">待跟进</span>
                    <div className="client-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="client-item">
                  <div className="client-avatar">C</div>
                  <div className="client-info">
                    <h5>客户 C</h5>
                    <p>已完成项目</p>
                    <p className="client-meta">
                      <span>联系电话: 137****9012</span>
                      <span>邮箱: clientC@example.com</span>
                    </p>
                    <p className="client-tags">
                      <span className="tag">移动应用</span>
                      <span className="tag">已完成</span>
                    </p>
                  </div>
                  <div className="client-status">
                    <span className="status-badge completed">已完成</span>
                    <div className="client-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>智能客户画像</h4>
              <div className="client-profile">
                <div className="profile-stats">
                  <div className="stat-card">
                    <p className="stat-value">3</p>
                    <p className="stat-label">总客户数</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">1</p>
                    <p className="stat-label">活跃客户</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">1</p>
                    <p className="stat-label">潜在客户</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">1</p>
                    <p className="stat-label">已完成</p>
                  </div>
                </div>
                <div className="profile-insights">
                  <h5>客户分类分析</h5>
                  <div className="insight-item">
                    <span className="insight-label">网站设计</span>
                    <div className="insight-bar">
                      <div className="insight-fill" style={{ width: '60%' }}></div>
                    </div>
                    <span className="insight-value">60%</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">品牌设计</span>
                    <div className="insight-bar">
                      <div className="insight-fill" style={{ width: '30%' }}></div>
                    </div>
                    <span className="insight-value">30%</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">移动应用</span>
                    <div className="insight-bar">
                      <div className="insight-fill" style={{ width: '10%' }}></div>
                    </div>
                    <span className="insight-value">10%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>客户名称</label>
                  <input type="text" placeholder="输入客户名称" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>联系电话</label>
                    <input type="tel" placeholder="输入联系电话" />
                  </div>
                  <div className="form-group">
                    <label>邮箱</label>
                    <input type="email" placeholder="输入邮箱" />
                  </div>
                </div>
                <div className="form-group">
                  <label>状态</label>
                  <select>
                    <option>活跃</option>
                    <option>待跟进</option>
                    <option>已完成</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>客户类型</label>
                  <select>
                    <option>个人</option>
                    <option>企业</option>
                    <option>政府</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>需求描述</label>
                  <textarea placeholder="输入客户需求描述" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>标签</label>
                  <input type="text" placeholder="输入标签，用逗号分隔" />
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加客户</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div className="sub-module-content">
            <h3>订单管理系统</h3>
            <div className="section">
              <h4>订单列表</h4>
              <div className="order-list">
                <div className="order-item">
                  <div className="order-info">
                    <h5>订单 #001</h5>
                    <p>客户 A - 项目 A</p>
                    <p className="order-meta">
                      <span>创建时间: 2026-02-25</span>
                      <span>完成时间: 2026-02-26</span>
                    </p>
                    <p className="order-description">网站设计服务 - 包含首页、产品页、联系页</p>
                  </div>
                  <div className="order-details">
                    <p className="order-amount">¥3,200</p>
                    <span className="status-badge completed">已完成</span>
                    <div className="order-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="order-item">
                  <div className="order-info">
                    <h5>订单 #002</h5>
                    <p>客户 B - 项目 B</p>
                    <p className="order-meta">
                      <span>创建时间: 2026-02-26</span>
                      <span>预计完成: 2026-03-05</span>
                    </p>
                    <p className="order-description">品牌标识设计 - 包含logo、名片、信笺</p>
                  </div>
                  <div className="order-details">
                    <p className="order-amount">¥2,500</p>
                    <span className="status-badge pending">处理中</span>
                    <div className="order-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>智能定价建议</h4>
              <div className="pricing-suggestion">
                <p>基于历史数据和市场分析，为新订单提供智能定价建议：</p>
                <div className="price-cards">
                  <div className="price-card">
                    <h5>基础套餐</h5>
                    <p className="price">¥1,800</p>
                    <p>适合简单项目</p>
                    <button className="btn btn-sm">选择</button>
                  </div>
                  <div className="price-card recommended">
                    <h5>标准套餐</h5>
                    <p className="price">¥2,800</p>
                    <p>最受欢迎的选择</p>
                    <button className="btn btn-sm">选择</button>
                  </div>
                  <div className="price-card">
                    <h5>高级套餐</h5>
                    <p className="price">¥4,500</p>
                    <p>包含全部功能</p>
                    <button className="btn btn-sm">选择</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>客户</label>
                  <select>
                    <option>客户 A</option>
                    <option>客户 B</option>
                    <option>新建客户</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>项目</label>
                  <input type="text" placeholder="输入项目名称" />
                </div>
                <div className="form-group">
                  <label>金额</label>
                  <input type="number" placeholder="输入金额" />
                </div>
                <div className="form-group">
                  <label>状态</label>
                  <select>
                    <option>待处理</option>
                    <option>处理中</option>
                    <option>已完成</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea placeholder="输入订单描述" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>预计完成日期</label>
                  <input type="date" />
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加订单</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'team':
        return (
          <div className="sub-module-content">
            <h3>团队协作管理</h3>
            <div className="section">
              <h4>团队成员</h4>
              <div className="team-list">
                <div className="team-item">
                  <div className="team-avatar">U</div>
                  <div className="team-info">
                    <h5>用户</h5>
                    <p>管理员</p>
                    <p className="team-meta">
                      <span>邮箱: admin@example.com</span>
                      <span>加入时间: 2026-01-01</span>
                    </p>
                    <p className="team-tags">
                      <span className="tag">管理</span>
                      <span className="tag">设计</span>
                      <span className="tag">开发</span>
                    </p>
                  </div>
                  <div className="team-status">
                    <span className="status-badge active">在线</span>
                    <div className="team-actions">
                      <button className="btn btn-sm">编辑</button>
                      <button className="btn btn-sm">移除</button>
                    </div>
                  </div>
                </div>
                <div className="team-item">
                  <div className="team-avatar">D</div>
                  <div className="team-info">
                    <h5>设计师</h5>
                    <p>设计师</p>
                    <p className="team-meta">
                      <span>邮箱: designer@example.com</span>
                      <span>加入时间: 2026-01-15</span>
                    </p>
                    <p className="team-tags">
                      <span className="tag">设计</span>
                      <span className="tag">UI/UX</span>
                    </p>
                  </div>
                  <div className="team-status">
                    <span className="status-badge active">在线</span>
                    <div className="team-actions">
                      <button className="btn btn-sm">编辑</button>
                      <button className="btn btn-sm">移除</button>
                    </div>
                  </div>
                </div>
                <div className="team-item">
                  <div className="team-avatar">D</div>
                  <div className="team-info">
                    <h5>开发者</h5>
                    <p>开发工程师</p>
                    <p className="team-meta">
                      <span>邮箱: developer@example.com</span>
                      <span>加入时间: 2026-02-01</span>
                    </p>
                    <p className="team-tags">
                      <span className="tag">开发</span>
                      <span className="tag">前端</span>
                      <span className="tag">后端</span>
                    </p>
                  </div>
                  <div className="team-status">
                    <span className="status-badge pending">离线</span>
                    <div className="team-actions">
                      <button className="btn btn-sm">编辑</button>
                      <button className="btn btn-sm">移除</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>团队协作统计</h4>
              <div className="team-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-value">3</p>
                    <p className="stat-label">团队成员</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">2</p>
                    <p className="stat-label">在线成员</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">5</p>
                    <p className="stat-label">进行中任务</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">80%</p>
                    <p className="stat-label">任务完成率</p>
                  </div>
                </div>
                <div className="team-performance">
                  <h5>团队成员绩效</h5>
                  <div className="performance-item">
                    <span className="performance-name">用户</span>
                    <div className="performance-bar">
                      <div className="performance-fill" style={{ width: '95%' }}></div>
                    </div>
                    <span className="performance-value">95%</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-name">设计师</span>
                    <div className="performance-bar">
                      <div className="performance-fill" style={{ width: '85%' }}></div>
                    </div>
                    <span className="performance-value">85%</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-name">开发者</span>
                    <div className="performance-bar">
                      <div className="performance-fill" style={{ width: '75%' }}></div>
                    </div>
                    <span className="performance-value">75%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>任务分配</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>任务名称</label>
                  <input type="text" placeholder="输入任务名称" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>负责人</label>
                    <select>
                      <option>用户</option>
                      <option>设计师</option>
                      <option>开发者</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>优先级</label>
                    <select>
                      <option>高</option>
                      <option>中</option>
                      <option>低</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>开始日期</label>
                    <input type="date" />
                  </div>
                  <div className="form-group">
                    <label>截止日期</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="form-group">
                  <label>任务描述</label>
                  <textarea placeholder="输入任务描述" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>标签</label>
                  <input type="text" placeholder="输入标签，用逗号分隔" />
                </div>
                <div className="form-actions">
                  <button className="btn">批量分配</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">分配任务</button>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>团队项目</h4>
              <div className="project-list">
                <div className="project-item">
                  <div className="project-info">
                    <h5>项目 A</h5>
                    <p>网站设计项目</p>
                    <div className="project-meta">
                      <span>开始日期: 2026-02-01</span>
                      <span>截止日期: 2026-03-01</span>
                    </div>
                  </div>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '80%' }}></div>
                    </div>
                    <p>80% 完成</p>
                    <button className="btn btn-sm">查看详情</button>
                  </div>
                </div>
                <div className="project-item">
                  <div className="project-info">
                    <h5>项目 B</h5>
                    <p>品牌标识设计</p>
                    <div className="project-meta">
                      <span>开始日期: 2026-02-15</span>
                      <span>截止日期: 2026-03-15</span>
                    </div>
                  </div>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '30%' }}></div>
                    </div>
                    <p>30% 完成</p>
                    <button className="btn btn-sm">查看详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      // 财务中心子模块
      case 'reports':
        return (
          <div className="sub-module-content">
            <h3>实时财务数据</h3>
            <div className="section">
              <h4>财务概览</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-value">¥15,000</p>
                  <p className="stat-label">本月收入</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">¥8,000</p>
                  <p className="stat-label">本月支出</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">¥7,000</p>
                  <p className="stat-label">本月利润</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">47%</p>
                  <p className="stat-label">利润率</p>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>收支明细</h4>
              <div className="finance-list">
                <div className="finance-item income">
                  <div className="finance-info">
                    <h5>项目 A 收入</h5>
                    <p>网站设计服务</p>
                    <p className="finance-meta">2026-02-25</p>
                  </div>
                  <div className="finance-amount">+¥3,200</div>
                </div>
                <div className="finance-item income">
                  <div className="finance-info">
                    <h5>项目 B 收入</h5>
                    <p>品牌标识设计</p>
                    <p className="finance-meta">2026-02-20</p>
                  </div>
                  <div className="finance-amount">+¥2,500</div>
                </div>
                <div className="finance-item expense">
                  <div className="finance-info">
                    <h5>软件订阅</h5>
                    <p>设计工具订阅</p>
                    <p className="finance-meta">2026-02-15</p>
                  </div>
                  <div className="finance-amount">-¥1,200</div>
                </div>
                <div className="finance-item expense">
                  <div className="finance-info">
                    <h5>办公费用</h5>
                    <p>办公用品</p>
                    <p className="finance-meta">2026-02-10</p>
                  </div>
                  <div className="finance-amount">-¥800</div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>财务趋势</h4>
              <div className="finance-trend">
                <div className="trend-item">
                  <span className="trend-label">1月</span>
                  <div className="trend-bar">
                    <div className="trend-fill income" style={{ height: '60%' }}></div>
                    <div className="trend-fill expense" style={{ height: '40%' }}></div>
                  </div>
                  <span className="trend-value">¥12,000</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">2月</span>
                  <div className="trend-bar">
                    <div className="trend-fill income" style={{ height: '70%' }}></div>
                    <div className="trend-fill expense" style={{ height: '30%' }}></div>
                  </div>
                  <span className="trend-value">¥15,000</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">3月</span>
                  <div className="trend-bar">
                    <div className="trend-fill income" style={{ height: '80%' }}></div>
                    <div className="trend-fill expense" style={{ height: '20%' }}></div>
                  </div>
                  <span className="trend-value">¥18,000</span>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>类型</label>
                    <select>
                      <option>收入</option>
                      <option>支出</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>分类</label>
                    <select>
                      <option>项目收入</option>
                      <option>软件订阅</option>
                      <option>办公费用</option>
                      <option>营销费用</option>
                      <option>其他</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>金额</label>
                  <input type="number" placeholder="输入金额" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>日期</label>
                    <input type="date" />
                  </div>
                  <div className="form-group">
                    <label>来源/用途</label>
                    <input type="text" placeholder="输入来源或用途" />
                  </div>
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea placeholder="输入详细描述" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加记录</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'budget':
        return (
          <div className="sub-module-content">
            <h3>智能预算管理</h3>
            <div className="section">
              <h4>预算概览</h4>
              <div className="budget-list">
                <div className="budget-item">
                  <div className="budget-info">
                    <h5>营销预算</h5>
                    <p>本月</p>
                    <p className="budget-meta">2026-02-01 至 2026-02-29</p>
                  </div>
                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <p>¥3,000 / ¥5,000</p>
                    <span className="budget-status warning">接近预算</span>
                  </div>
                </div>
                <div className="budget-item">
                  <div className="budget-info">
                    <h5>软件订阅</h5>
                    <p>本月</p>
                    <p className="budget-meta">2026-02-01 至 2026-02-29</p>
                  </div>
                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '30%' }}></div>
                    </div>
                    <p>¥1,500 / ¥5,000</p>
                    <span className="budget-status normal">正常</span>
                  </div>
                </div>
                <div className="budget-item">
                  <div className="budget-info">
                    <h5>办公费用</h5>
                    <p>本月</p>
                    <p className="budget-meta">2026-02-01 至 2026-02-29</p>
                  </div>
                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '90%' }}></div>
                    </div>
                    <p>¥4,500 / ¥5,000</p>
                    <span className="budget-status danger">超出预算</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>预算分析</h4>
              <div className="budget-analysis">
                <div className="analysis-chart">
                  <h5>预算使用分布</h5>
                  <div className="chart-placeholder">
                    <p>📊 预算使用饼图</p>
                  </div>
                </div>
                <div className="analysis-insights">
                  <h5>智能建议</h5>
                  <div className="insight-item">
                    <span className="insight-icon">💡</span>
                    <p>办公费用已接近预算上限，建议控制支出</p>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">📈</span>
                    <p>营销预算使用效率较高，建议适当增加投入</p>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">💰</span>
                    <p>软件订阅预算充足，可考虑升级必要工具</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>预算名称</label>
                  <input type="text" placeholder="输入预算名称" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>金额</label>
                    <input type="number" placeholder="输入金额" />
                  </div>
                  <div className="form-group">
                    <label>周期</label>
                    <select>
                      <option>本月</option>
                      <option>本季度</option>
                      <option>本年</option>
                      <option>自定义</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>开始日期</label>
                    <input type="date" />
                  </div>
                  <div className="form-group">
                    <label>结束日期</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea placeholder="输入预算描述" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加预算</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'tax':
        return (
          <div className="sub-module-content">
            <h3>财务与税务智能</h3>
            <div className="section">
              <h4>税务概览</h4>
              <div className="tax-overview">
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-value">¥2,100</p>
                    <p className="stat-label">本月应纳税额</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">¥14,000</p>
                    <p className="stat-label">应税收入</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">15%</p>
                    <p className="stat-label">税率</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">2026-03-15</p>
                    <p className="stat-label">申报截止</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>税务记录</h4>
              <div className="tax-list">
                <div className="tax-item">
                  <div className="tax-info">
                    <h5>增值税</h5>
                    <p>2026年1月</p>
                    <p className="tax-meta">申报日期: 2026-02-15</p>
                  </div>
                  <div className="tax-amount">¥1,800</div>
                  <div className="tax-status">
                    <span className="status-badge completed">已申报</span>
                  </div>
                </div>
                <div className="tax-item">
                  <div className="tax-info">
                    <h5>增值税</h5>
                    <p>2026年2月</p>
                    <p className="tax-meta">申报日期: 2026-03-15</p>
                  </div>
                  <div className="tax-amount">¥2,100</div>
                  <div className="tax-status">
                    <span className="status-badge pending">待申报</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>税务智能建议</h4>
              <div className="tax-suggestions">
                <div className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <div className="suggestion-content">
                    <h5>税务筹划建议</h5>
                    <p>建议合理利用小微企业税收优惠政策，降低税负</p>
                  </div>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-icon">⚠️</span>
                  <div className="suggestion-content">
                    <h5>申报提醒</h5>
                    <p>2026年2月增值税申报截止日期为3月15日，请及时申报</p>
                  </div>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-icon">📊</span>
                  <div className="suggestion-content">
                    <h5>税务分析</h5>
                    <p>本月税负率为15%，低于行业平均水平，税务筹划效果良好</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>税种</label>
                    <select>
                      <option>增值税</option>
                      <option>企业所得税</option>
                      <option>个人所得税</option>
                      <option>其他税种</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>金额</label>
                    <input type="number" placeholder="输入金额" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>所属期间</label>
                    <input type="month" />
                  </div>
                  <div className="form-group">
                    <label>申报日期</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="form-group">
                  <label>备注</label>
                  <textarea placeholder="输入备注信息" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加税务记录</button>
                </div>
              </div>
            </div>
          </div>
        )
      
      // AI助手子模块
      case 'ai-assistant':
        return (
          <div className="sub-module-content">
            <h3>AI助手</h3>
            <div className="section">
              <h4>智能问答</h4>
              <div className="ai-chat">
                <div className="chat-messages" ref={chatMessagesRef}>
                  {aiMessages.map(message => (
                    <div key={message.id} className={`chat-message ${message.sender}`}>
                      <div className="message-avatar">
                        {message.sender === 'ai' ? '🤖' : '👤'}
                      </div>
                      <div className="message-content">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input 
                    type="text" 
                    placeholder="输入你的问题，例如：'今天有什么待办事项？'" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiMessageSend()}
                  />
                  <button className="btn-primary" onClick={handleAiMessageSend}>
                    发送
                  </button>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>常用问题</h4>
              <div className="quick-questions">
                <button 
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestionClick('今天有什么待办事项？')}
                >
                  今天有什么待办事项？
                </button>
                <button 
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestionClick('如何添加新客户？')}
                >
                  如何添加新客户？
                </button>
                <button 
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestionClick('查看本月财务报表')}
                >
                  查看本月财务报表
                </button>
                <button 
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestionClick('启动专注模式')}
                >
                  启动专注模式
                </button>
              </div>
            </div>
            <div className="section">
              <h4>智能建议</h4>
              <div className="ai-suggestions">
                <div className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <div className="suggestion-content">
                    <h5>优化工作流程</h5>
                    <p>建议设置自动化工作流，减少重复操作</p>
                  </div>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-icon">📈</span>
                  <div className="suggestion-content">
                    <h5>财务分析</h5>
                    <p>本月支出高于预算，建议查看详细报表</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      // 设置子模块
      case 'settings':
        return (
          <div className="sub-module-content">
            <h3>系统设置</h3>
            <div className="section">
              <h4>个人信息</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>用户名</label>
                  <input type="text" placeholder="输入用户名" defaultValue="用户" />
                </div>
                <div className="form-group">
                  <label>邮箱</label>
                  <input type="email" placeholder="输入邮箱" />
                </div>
                <div className="form-group">
                  <label>角色</label>
                  <select defaultValue="管理员">
                    <option>管理员</option>
                    <option>普通用户</option>
                  </select>
                </div>
                <button className="btn-primary">保存修改</button>
              </div>
            </div>
            <div className="section">
              <h4>系统设置</h4>
              <div className="focus-settings">
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>启用通知</label>
                </div>
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>自动备份数据</label>
                </div>
                <div className="setting-item">
                  <input type="checkbox" />
                  <label>启用深色模式</label>
                </div>
                <div className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <label>启用AI助手</label>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>API集成管理</h4>
              <div className="integration-list">
                {integrations.map(integration => (
                  <div key={integration.id} className="integration-item">
                    <div className="integration-info">
                      <h5>{integration.name}</h5>
                      <p>{integration.description}</p>
                    </div>
                    <div className="integration-status">
                      <span className={`status-badge ${integration.status}`}>
                        {integration.status === 'pending' ? '未连接' : 
                         integration.status === 'connecting' ? '连接中' : '已连接'}
                      </span>
                      <button 
                        className="btn btn-sm"
                        onClick={() => {
                          if (integration.status === 'active') {
                            handleIntegrationDisconnect(integration.id)
                          } else if (integration.status === 'pending') {
                            handleIntegrationConnect(integration.id)
                          }
                        }}
                        disabled={integration.status === 'connecting'}
                      >
                        {integration.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <h4>关于系统</h4>
              <div className="system-info">
                <p><strong>版本：</strong> 0.1.0</p>
                <p><strong>系统：</strong> SoloOS 一人公司操作系统</p>
                <p><strong>描述：</strong> 为一人公司打造的智能运营管理系统</p>
              </div>
            </div>
          </div>
        )
      
      // 增长引擎子模块
      case 'channels':
        return (
          <div className="sub-module-content">
            <h3>营销渠道管理</h3>
            <div className="section">
              <h4>渠道列表</h4>
              <div className="channel-list">
                <div className="channel-item">
                  <div className="channel-info">
                    <h5>微信</h5>
                    <p>社群端</p>
                    <p className="channel-meta">
                      <span>创建时间: 2026-01-01</span>
                      <span>最后活跃: 2026-02-27</span>
                    </p>
                    <p className="channel-tags">
                      <span className="tag">高转化</span>
                      <span className="tag">低成本</span>
                    </p>
                  </div>
                  <div className="channel-performance">
                    <p className="performance-value">高</p>
                    <span className="status-badge active">活跃</span>
                    <div className="channel-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="channel-item">
                  <div className="channel-info">
                    <h5>小红书</h5>
                    <p>内容端</p>
                    <p className="channel-meta">
                      <span>创建时间: 2026-01-15</span>
                      <span>最后活跃: 2026-02-26</span>
                    </p>
                    <p className="channel-tags">
                      <span className="tag">高流量</span>
                      <span className="tag">中转化</span>
                    </p>
                  </div>
                  <div className="channel-performance">
                    <p className="performance-value">中</p>
                    <span className="status-badge active">活跃</span>
                    <div className="channel-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="channel-item">
                  <div className="channel-info">
                    <h5>抖音</h5>
                    <p>媒体端</p>
                    <p className="channel-meta">
                      <span>创建时间: 2026-02-01</span>
                      <span>最后活跃: 2026-02-25</span>
                    </p>
                    <p className="channel-tags">
                      <span className="tag">高曝光</span>
                      <span className="tag">低转化</span>
                    </p>
                  </div>
                  <div className="channel-performance">
                    <p className="performance-value">低</p>
                    <span className="status-badge pending">待优化</span>
                    <div className="channel-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>渠道效果分析</h4>
              <div className="channel-analysis">
                <div className="analysis-chart">
                  <h5>渠道效果对比</h5>
                  <div className="chart-placeholder">
                    <p>📊 渠道效果柱状图</p>
                  </div>
                </div>
                <div className="analysis-insights">
                  <h5>智能建议</h5>
                  <div className="insight-item">
                    <span className="insight-icon">💡</span>
                    <p>微信渠道效果最佳，建议增加投入</p>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">📈</span>
                    <p>小红书渠道增长潜力大，建议优化内容策略</p>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">⚠️</span>
                    <p>抖音渠道转化较低，建议调整投放策略</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>渠道名称</label>
                  <input type="text" placeholder="输入渠道名称" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>类型</label>
                    <select>
                      <option>内容端</option>
                      <option>社群端</option>
                      <option>媒体端</option>
                      <option>设计端</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>效果</label>
                    <select>
                      <option>高</option>
                      <option>中</option>
                      <option>低</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea placeholder="输入渠道描述" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>标签</label>
                  <input type="text" placeholder="输入标签，用逗号分隔" />
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加渠道</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="sub-module-content">
            <h3>产品服务包管理</h3>
            <div className="section">
              <h4>产品列表</h4>
              <div className="product-list">
                <div className="product-item">
                  <div className="product-info">
                    <h5>标准咨询服务</h5>
                    <p>标准化服务产品</p>
                    <p className="product-meta">
                      <span>创建时间: 2026-01-01</span>
                      <span>状态: 在售</span>
                    </p>
                    <p className="product-tags">
                      <span className="tag">咨询</span>
                      <span className="tag">标准</span>
                    </p>
                  </div>
                  <div className="product-details">
                    <div className="product-price">
                      <p>¥2,000</p>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="product-item">
                  <div className="product-info">
                    <h5>品牌设计套餐</h5>
                    <p>包含logo、名片、信笺设计</p>
                    <p className="product-meta">
                      <span>创建时间: 2026-01-15</span>
                      <span>状态: 在售</span>
                    </p>
                    <p className="product-tags">
                      <span className="tag">设计</span>
                      <span className="tag">品牌</span>
                    </p>
                  </div>
                  <div className="product-details">
                    <div className="product-price">
                      <p>¥3,500</p>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
                <div className="product-item">
                  <div className="product-info">
                    <h5>网站开发套餐</h5>
                    <p>包含前端、后端开发和部署</p>
                    <p className="product-meta">
                      <span>创建时间: 2026-02-01</span>
                      <span>状态: 在售</span>
                    </p>
                    <p className="product-tags">
                      <span className="tag">开发</span>
                      <span className="tag">网站</span>
                    </p>
                  </div>
                  <div className="product-details">
                    <div className="product-price">
                      <p>¥8,000</p>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-sm">查看详情</button>
                      <button className="btn btn-sm">编辑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>产品销售分析</h4>
              <div className="product-analysis">
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-value">3</p>
                    <p className="stat-label">产品数量</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">¥13,500</p>
                    <p className="stat-label">总价值</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">15</p>
                    <p className="stat-label">本月销售</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-value">¥45,000</p>
                    <p className="stat-label">本月收入</p>
                  </div>
                </div>
                <div className="analysis-insights">
                  <h5>销售趋势</h5>
                  <div className="chart-placeholder">
                    <p>📊 产品销售趋势图</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>产品名称</label>
                  <input type="text" placeholder="输入产品名称" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>价格</label>
                    <input type="number" placeholder="输入价格" />
                  </div>
                  <div className="form-group">
                    <label>状态</label>
                    <select>
                      <option>在售</option>
                      <option>下架</option>
                      <option>即将上线</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea placeholder="输入产品描述" rows="4"></textarea>
                </div>
                <div className="form-group">
                  <label>包含服务</label>
                  <textarea placeholder="输入包含的服务内容" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>标签</label>
                  <input type="text" placeholder="输入标签，用逗号分隔" />
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加产品</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'knowledge':
        return (
          <div className="sub-module-content">
            <h3>知识内容管理</h3>
            <div className="section">
              <h4>知识库概览</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-value">12</p>
                  <p className="stat-label">知识条目</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">5</p>
                  <p className="stat-label">分类</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">8</p>
                  <p className="stat-label">本月新增</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">45</p>
                  <p className="stat-label">访问次数</p>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>知识列表</h4>
              <div className="knowledge-list">
                <div className="knowledge-item">
                  <div className="knowledge-info">
                    <h5>网站设计最佳实践</h5>
                    <p>详细介绍网站设计的基本原则和最佳实践</p>
                    <p className="knowledge-meta">
                      <span>创建时间: 2026-01-10</span>
                      <span>分类: 设计</span>
                    </p>
                    <p className="knowledge-tags">
                      <span className="tag">网站设计</span>
                      <span className="tag">最佳实践</span>
                    </p>
                  </div>
                  <div className="knowledge-actions">
                    <button className="btn btn-sm">查看</button>
                    <button className="btn btn-sm">编辑</button>
                  </div>
                </div>
                <div className="knowledge-item">
                  <div className="knowledge-info">
                    <h5>品牌标识设计指南</h5>
                    <p>品牌标识设计的流程和关键要素</p>
                    <p className="knowledge-meta">
                      <span>创建时间: 2026-01-15</span>
                      <span>分类: 设计</span>
                    </p>
                    <p className="knowledge-tags">
                      <span className="tag">品牌设计</span>
                      <span className="tag">标识</span>
                    </p>
                  </div>
                  <div className="knowledge-actions">
                    <button className="btn btn-sm">查看</button>
                    <button className="btn btn-sm">编辑</button>
                  </div>
                </div>
                <div className="knowledge-item">
                  <div className="knowledge-info">
                    <h5>前端开发技术栈选择</h5>
                    <p>现代前端开发技术栈的比较和选择建议</p>
                    <p className="knowledge-meta">
                      <span>创建时间: 2026-02-01</span>
                      <span>分类: 开发</span>
                    </p>
                    <p className="knowledge-tags">
                      <span className="tag">前端开发</span>
                      <span className="tag">技术栈</span>
                    </p>
                  </div>
                  <div className="knowledge-actions">
                    <button className="btn btn-sm">查看</button>
                    <button className="btn btn-sm">编辑</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>知识分类</h4>
              <div className="knowledge-categories">
                <div className="category-item">
                  <span className="category-name">设计</span>
                  <span className="category-count">5 条</span>
                </div>
                <div className="category-item">
                  <span className="category-name">开发</span>
                  <span className="category-count">3 条</span>
                </div>
                <div className="category-item">
                  <span className="category-name">营销</span>
                  <span className="category-count">2 条</span>
                </div>
                <div className="category-item">
                  <span className="category-name">管理</span>
                  <span className="category-count">2 条</span>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>标题</label>
                  <input type="text" placeholder="输入标题" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>分类</label>
                    <select>
                      <option>设计</option>
                      <option>开发</option>
                      <option>营销</option>
                      <option>管理</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>标签</label>
                    <input type="text" placeholder="输入标签，用逗号分隔" />
                  </div>
                </div>
                <div className="form-group">
                  <label>内容</label>
                  <textarea placeholder="输入内容" rows="6"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">添加知识</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'business-graph':
        return (
          <div className="sub-module-content">
            <h3>个人业务图谱</h3>
            <div className="section">
              <h4>智能搜索</h4>
              <div className="search-bar">
                <input type="text" placeholder="搜索业务相关的文档、邮件内容、客户等" />
                <button className="btn-primary">搜索</button>
              </div>
            </div>
            <div className="section">
              <h4>关联网络</h4>
              <div className="business-graph-container">
                <div className="graph-placeholder">
                  <p>📊 客户-项目-文档-工作-工具的关联网络</p>
                  <div className="graph-legend">
                    <div className="legend-item">
                      <span className="legend-color customer"></span>
                      <span>客户</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color project"></span>
                      <span>项目</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color document"></span>
                      <span>文档</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color task"></span>
                      <span>工作</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color tool"></span>
                      <span>工具</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>关联分析</h4>
              <div className="connection-analysis">
                <div className="analysis-item">
                  <h5>客户关联</h5>
                  <p>客户 A 与项目 A、文档 X、工具 Notion 相关联</p>
                </div>
                <div className="analysis-item">
                  <h5>项目关联</h5>
                  <p>项目 A 与客户 A、文档 X、任务 Y 相关联</p>
                </div>
                <div className="analysis-item">
                  <h5>工具使用</h5>
                  <p>Notion 用于项目 A 和项目 B 的文档管理</p>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据录入</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>关联类型</label>
                  <select>
                    <option>客户-项目</option>
                    <option>项目-文档</option>
                    <option>任务-工具</option>
                    <option>客户-文档</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>源对象</label>
                    <input type="text" placeholder="输入源对象名称" />
                  </div>
                  <div className="form-group">
                    <label>目标对象</label>
                    <input type="text" placeholder="输入目标对象名称" />
                  </div>
                </div>
                <div className="form-group">
                  <label>关联描述</label>
                  <textarea placeholder="输入关联描述" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">批量导入</button>
                  <button className="btn-primary">添加关联</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'automation':
        return (
          <div className="sub-module-content">
            <h3>渐进式自动化</h3>
            <div className="section">
              <h4>智能规则</h4>
              <div className="automation-rules">
                <div className="rule-item">
                  <div className="rule-header">
                    <h5>客户跟进提醒</h5>
                    <span className="rule-status active">已启用</span>
                  </div>
                  <p>当客户超过3天未跟进时，自动发送提醒</p>
                  <div className="rule-actions">
                    <button className="btn btn-sm">编辑</button>
                    <button className="btn btn-sm">禁用</button>
                  </div>
                </div>
                <div className="rule-item">
                  <div className="rule-header">
                    <h5>财务报表生成</h5>
                    <span className="rule-status active">已启用</span>
                  </div>
                  <p>每月1号自动生成上月财务报表</p>
                  <div className="rule-actions">
                    <button className="btn btn-sm">编辑</button>
                    <button className="btn btn-sm">禁用</button>
                  </div>
                </div>
                <div className="rule-item">
                  <div className="rule-header">
                    <h5>任务优先级调整</h5>
                    <span className="rule-status inactive">已禁用</span>
                  </div>
                  <p>根据截止日期自动调整任务优先级</p>
                  <div className="rule-actions">
                    <button className="btn btn-sm">编辑</button>
                    <button className="btn btn-sm">启用</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>智能提示</h4>
              <div className="automation-suggestions">
                <div className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <div className="suggestion-content">
                    <h5>创建自动备份规则</h5>
                    <p>系统检测到您每天手动备份数据，建议创建自动备份规则</p>
                    <button className="btn btn-sm">创建规则</button>
                  </div>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <div className="suggestion-content">
                    <h5>优化客户跟进流程</h5>
                    <p>系统检测到您的客户跟进流程可优化，建议创建自动化跟进规则</p>
                    <button className="btn btn-sm">创建规则</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>自动化流程</h4>
              <div className="automation-flows">
                <div className="flow-item">
                  <h5>客户入职流程</h5>
                  <div className="flow-steps">
                    <div className="flow-step completed">
                      <span className="step-number">1</span>
                      <span className="step-text">创建客户档案</span>
                    </div>
                    <div className="flow-step active">
                      <span className="step-number">2</span>
                      <span className="step-text">发送欢迎邮件</span>
                    </div>
                    <div className="flow-step">
                      <span className="step-number">3</span>
                      <span className="step-text">安排初次会议</span>
                    </div>
                    <div className="flow-step">
                      <span className="step-number">4</span>
                      <span className="step-text">创建项目计划</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>创建规则</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>规则名称</label>
                  <input type="text" placeholder="输入规则名称" />
                </div>
                <div className="form-group">
                  <label>触发条件</label>
                  <select>
                    <option>时间触发</option>
                    <option>事件触发</option>
                    <option>条件触发</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>执行动作</label>
                  <select>
                    <option>发送通知</option>
                    <option>创建任务</option>
                    <option>生成报表</option>
                    <option>发送邮件</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>规则描述</label>
                  <textarea placeholder="输入规则描述" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">从模板创建</button>
                  <button className="btn-primary">创建规则</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'data-collection':
        return (
          <div className="sub-module-content">
            <h3>多平台数据采集</h3>
            <div className="section">
              <h4>数据来源管理</h4>
              <div className="data-sources">
                <div className="source-item">
                  <div className="source-info">
                    <h5>微信</h5>
                    <p>社交与支付平台</p>
                  </div>
                  <div className="source-status">
                    <span className="status-badge active">已连接</span>
                    <button className="btn btn-sm">管理</button>
                  </div>
                </div>
                <div className="source-item">
                  <div className="source-info">
                    <h5>支付宝</h5>
                    <p>支付平台</p>
                  </div>
                  <div className="source-status">
                    <span className="status-badge active">已连接</span>
                    <button className="btn btn-sm">管理</button>
                  </div>
                </div>
                <div className="source-item">
                  <div className="source-info">
                    <h5>银行流水</h5>
                    <p>财务数据</p>
                  </div>
                  <div className="source-status">
                    <span className="status-badge pending">未连接</span>
                    <button className="btn btn-sm">连接</button>
                  </div>
                </div>
                <div className="source-item">
                  <div className="source-info">
                    <h5>Stripe</h5>
                    <p>支付处理工具</p>
                  </div>
                  <div className="source-status">
                    <span className="status-badge pending">未连接</span>
                    <button className="btn btn-sm">连接</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据采集状态</h4>
              <div className="collection-status">
                <div className="status-item">
                  <h5>最近采集</h5>
                  <p>2026-02-27 14:30</p>
                </div>
                <div className="status-item">
                  <h5>采集频率</h5>
                  <p>每小时</p>
                </div>
                <div className="status-item">
                  <h5>数据总量</h5>
                  <p>1,245 条记录</p>
                </div>
                <div className="status-item">
                  <h5>成功率</h5>
                  <p>98.5%</p>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>数据采集历史</h4>
              <div className="collection-history">
                <div className="history-item">
                  <div className="history-info">
                    <h5>微信数据采集</h5>
                    <p>成功采集 56 条记录</p>
                  </div>
                  <div className="history-time">2026-02-27 14:30</div>
                </div>
                <div className="history-item">
                  <div className="history-info">
                    <h5>支付宝数据采集</h5>
                    <p>成功采集 32 条记录</p>
                  </div>
                  <div className="history-time">2026-02-27 13:30</div>
                </div>
                <div className="history-item">
                  <div className="history-info">
                    <h5>微信数据采集</h5>
                    <p>成功采集 48 条记录</p>
                  </div>
                  <div className="history-time">2026-02-27 12:30</div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>采集设置</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>采集频率</label>
                  <select>
                    <option>每小时</option>
                    <option>每6小时</option>
                    <option>每天</option>
                    <option>每周</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>数据保留期限</label>
                  <select>
                    <option>30天</option>
                    <option>90天</option>
                    <option>180天</option>
                    <option>1年</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>自动采集</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="form-actions">
                  <button className="btn">手动采集</button>
                  <button className="btn-primary">保存设置</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'local-ai':
        return (
          <div className="sub-module-content">
            <h3>本地优先AI</h3>
            <div className="section">
              <h4>本地AI模型</h4>
              <div className="ai-models">
                <div className="model-item">
                  <div className="model-info">
                    <h5>通用对话模型</h5>
                    <p>本地部署的对话模型</p>
                  </div>
                  <div className="model-status">
                    <span className="status-badge active">已启用</span>
                    <button className="btn btn-sm">管理</button>
                  </div>
                </div>
                <div className="model-item">
                  <div className="model-info">
                    <h5>文档分析模型</h5>
                    <p>本地部署的文档分析模型</p>
                  </div>
                  <div className="model-status">
                    <span className="status-badge active">已启用</span>
                    <button className="btn btn-sm">管理</button>
                  </div>
                </div>
                <div className="model-item">
                  <div className="model-info">
                    <h5>客户分析模型</h5>
                    <p>本地部署的客户分析模型</p>
                  </div>
                  <div className="model-status">
                    <span className="status-badge pending">未启用</span>
                    <button className="btn btn-sm">启用</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>敏感数据处理</h4>
              <div className="data-processing">
                <div className="processing-item">
                  <h5>数据本地化设置</h5>
                  <div className="setting-item">
                    <input type="checkbox" defaultChecked />
                    <label>启用本地数据处理</label>
                  </div>
                  <div className="setting-item">
                    <input type="checkbox" defaultChecked />
                    <label>加密本地存储</label>
                  </div>
                  <div className="setting-item">
                    <input type="checkbox" />
                    <label>允许云端备份（加密）</label>
                  </div>
                </div>
                <div className="processing-item">
                  <h5>数据处理状态</h5>
                  <div className="status-item">
                    <h6>本地处理率</h6>
                    <p>98%</p>
                  </div>
                  <div className="status-item">
                    <h6>数据安全评分</h6>
                    <p>95/100</p>
                  </div>
                  <div className="status-item">
                    <h6>最近处理时间</h6>
                    <p>2026-02-27 14:45</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>本地AI应用</h4>
              <div className="ai-applications">
                <div className="app-item">
                  <h5>智能客户分析</h5>
                  <p>基于本地数据的客户行为分析</p>
                  <button className="btn btn-sm">使用</button>
                </div>
                <div className="app-item">
                  <h5>文档智能处理</h5>
                  <p>本地处理文档，提取关键信息</p>
                  <button className="btn btn-sm">使用</button>
                </div>
                <div className="app-item">
                  <h5>个人助手</h5>
                  <p>基于本地数据的智能助手</p>
                  <button className="btn btn-sm">使用</button>
                </div>
              </div>
            </div>
            <div className="section">
              <h4>模型管理</h4>
              <div className="input-form">
                <div className="form-group">
                  <label>模型选择</label>
                  <select>
                    <option>通用对话模型</option>
                    <option>文档分析模型</option>
                    <option>客户分析模型</option>
                    <option>自定义模型</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>模型配置</label>
                  <textarea placeholder="输入模型配置参数" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn">测试模型</button>
                  <button className="btn-primary">应用配置</button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="sub-module-content">
            <h3>子模块</h3>
            <p>请选择一个功能进行操作</p>
          </div>
        )
    }
  }

  return (
    <div className="module">
      <div className="module-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{getSubModuleTitle(subModule)}</h3>
          <button className="btn" onClick={onClose}>
            <span>←</span>
            返回
          </button>
        </div>
      </div>
      <div className="module-content">
        {renderSubModuleContent()}
      </div>
    </div>
  )
}

// 辅助函数：获取子模块标题
function getSubModuleTitle(subModule) {
  const titles = {
    // 指令中心
    schedule: '智能日程管理',
    focus: '深度工作守护',
    health: '健康度监测',
    // 客户中心
    clients: '智能客户管理',
    orders: '订单管理系统',
    team: '团队协作管理',
    // 财务中心
    reports: '实时财务数据',
    budget: '智能预算管理',
    tax: '财务与税务智能',
    // 增长引擎
    channels: '营销渠道管理',
    products: '产品服务包管理',
    knowledge: '知识内容管理',
    // 系统设置
    settings: '系统设置',
    // AI助手
    'ai-assistant': 'AI助手',
    // 个人业务图谱
    'business-graph': '个人业务图谱',
    // 渐进式自动化
    automation: '渐进式自动化',
    // 多平台数据采集
    'data-collection': '多平台数据采集',
    // 本地优先AI
    'local-ai': '本地优先AI'
  }
  return titles[subModule] || '子模块'
}

export default App
