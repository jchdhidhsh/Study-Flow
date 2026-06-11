const path = require('path');

const ROOT_DIR = 'D:\\vscode\\Study-Flow';
const Tag = require(path.join(ROOT_DIR, 'src/domain/model/entity/Tag'));
const TaskTag = require(path.join(ROOT_DIR, 'src/domain/model/entity/TaskTag'));
const TagRepositoryImpl = require(path.join(ROOT_DIR, 'src/infrastructure/persistence/repository/TagRepositoryImpl'));
const TagApplicationService = require(path.join(ROOT_DIR, 'src/application/service/TagApplicationService'));

describe('Tag', () => {
  describe('constructor', () => {
    it('应创建带默认值的标签', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '工作',
        userId: 'user-1',
      });

      expect(tag.id).toBe('tag-1');
      expect(tag.name).toBe('工作');
      expect(tag.color).toBe('#808080'); // 默认灰色
      expect(tag.userId).toBe('user-1');
      expect(tag.createdAt).toBeInstanceOf(Date);
    });

    it('应创建带自定义颜色的标签', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '重要',
        color: '#FF0000',
        userId: 'user-1',
      });

      expect(tag.color).toBe('#FF0000');
    });
  });

  describe('rename', () => {
    it('应更新标签名称', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '旧名称',
        userId: 'user-1',
      });

      const result = tag.rename('新名称');

      expect(tag.name).toBe('新名称');
      expect(result).toBe(tag); // 链式调用
    });

    it('空名称应抛出异常', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '测试',
        userId: 'user-1',
      });

      expect(() => tag.rename('')).toThrow('标签名称不能为空');
      expect(() => tag.rename('   ')).toThrow('标签名称不能为空');
    });
  });

  describe('changeColor', () => {
    it('应更新标签颜色', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '测试',
        color: '#000000',
        userId: 'user-1',
      });

      const result = tag.changeColor('#FF0000');

      expect(tag.color).toBe('#FF0000');
      expect(result).toBe(tag);
    });

    it('无效颜色格式应抛出异常', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '测试',
        userId: 'user-1',
      });

      expect(() => tag.changeColor('red')).toThrow('颜色必须是有效的十六进制格式');
      expect(() => tag.changeColor('#FFF')).toThrow('颜色必须是有效的十六进制格式');
      expect(() => tag.changeColor('123456')).toThrow('颜色必须是有效的十六进制格式');
    });
  });

  describe('clone', () => {
    it('应创建标签副本', () => {
      const tag = new Tag({
        id: 'tag-1',
        name: '原始标签',
        color: '#FF0000',
        userId: 'user-1',
      });

      const clone = tag.clone();

      expect(clone.id).not.toBe(tag.id);
      expect(clone.name).toBe('原始标签 (副本)');
      expect(clone.color).toBe('#FF0000');
      expect(clone.userId).toBe(tag.userId);
    });
  });
});

describe('TaskTag', () => {
  describe('constructor', () => {
    it('应创建任务-标签关联', () => {
      const taskTag = new TaskTag({
        taskId: 'task-1',
        tagId: 'tag-1',
      });

      expect(taskTag.taskId).toBe('task-1');
      expect(taskTag.tagId).toBe('tag-1');
      expect(taskTag.createdAt).toBeInstanceOf(Date);
    });

    it('空 taskId 应抛出异常', () => {
      expect(() => new TaskTag({ tagId: 'tag-1' })).toThrow('taskId 不能为空');
    });

    it('空 tagId 应抛出异常', () => {
      expect(() => new TaskTag({ taskId: 'task-1' })).toThrow('tagId 不能为空');
    });
  });

  describe('static create', () => {
    it('应使用静态工厂方法创建', () => {
      const taskTag = TaskTag.create('task-1', 'tag-1');

      expect(taskTag.taskId).toBe('task-1');
      expect(taskTag.tagId).toBe('tag-1');
    });
  });
});

describe('TagRepositoryImpl', () => {
  let repository;

  beforeEach(() => {
    repository = new TagRepositoryImpl();
  });

  afterEach(() => {
    repository.clear();
  });

  describe('save', () => {
    it('应保存标签并返回', async () => {
      const tag = new Tag({
        name: '工作',
        userId: 'user-1',
      });

      const saved = await repository.save(tag);

      expect(saved.id).toBeTruthy();
      expect(saved.name).toBe('工作');
    });

    it('应更新已存在的标签', async () => {
      const tag = new Tag({
        id: 'tag-fixed',
        name: '原始名称',
        userId: 'user-1',
      });
      await repository.save(tag);

      tag.rename('新名称');
      const updated = await repository.save(tag);

      expect(updated.name).toBe('新名称');
    });
  });

  describe('findById', () => {
    it('应通过ID查找标签', async () => {
      const tag = new Tag({ id: 'tag-1', name: '测试', userId: 'user-1' });
      await repository.save(tag);

      const found = await repository.findById('tag-1');

      expect(found).not.toBeNull();
      expect(found.name).toBe('测试');
    });

    it('不存在的ID应返回null', async () => {
      const found = await repository.findById('non-existent');
      expect(found).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('应返回用户的所有标签', async () => {
      await repository.save(new Tag({ name: '标签1', userId: 'user-1' }));
      await repository.save(new Tag({ name: '标签2', userId: 'user-1' }));
      await repository.save(new Tag({ name: '标签3', userId: 'user-2' }));

      const tags = await repository.findByUserId('user-1');

      expect(tags).toHaveLength(2);
    });
  });

  describe('findByName', () => {
    it('应按名称查找标签', async () => {
      await repository.save(new Tag({ name: '工作', userId: 'user-1' }));

      const found = await repository.findByName('工作', 'user-1');

      expect(found).not.toBeNull();
      expect(found.name).toBe('工作');
    });

    it('不同用户的同名标签应分开查找', async () => {
      await repository.save(new Tag({ name: '工作', userId: 'user-1' }));
      await repository.save(new Tag({ name: '工作', userId: 'user-2' }));

      const found1 = await repository.findByName('工作', 'user-1');
      const found2 = await repository.findByName('工作', 'user-2');

      expect(found1.userId).toBe('user-1');
      expect(found2.userId).toBe('user-2');
    });
  });

  describe('addTagToTask / findTagsByTaskId', () => {
    it('应添加并查询任务的标签', async () => {
      const tag = new Tag({ id: 'tag-1', name: '重要', userId: 'user-1' });
      await repository.save(tag);

      await repository.addTagToTask('task-1', 'tag-1');
      const tags = await repository.findTagsByTaskId('task-1');

      expect(tags).toHaveLength(1);
      expect(tags[0].name).toBe('重要');
    });

    it('一个任务可有多个标签', async () => {
      await repository.save(new Tag({ id: 'tag-1', name: '标签1', userId: 'user-1' }));
      await repository.save(new Tag({ id: 'tag-2', name: '标签2', userId: 'user-1' }));

      await repository.addTagToTask('task-1', 'tag-1');
      await repository.addTagToTask('task-1', 'tag-2');

      const tags = await repository.findTagsByTaskId('task-1');

      expect(tags).toHaveLength(2);
    });
  });

  describe('removeTagFromTask', () => {
    it('应从任务移除标签', async () => {
      await repository.addTagToTask('task-1', 'tag-1');

      const removed = await repository.removeTagFromTask('task-1', 'tag-1');

      expect(removed).toBe(true);
      const tags = await repository.findTagsByTaskId('task-1');
      expect(tags).toHaveLength(0);
    });
  });

  describe('findTaskIdsByTagId', () => {
    it('应返回关联了指定标签的所有任务ID', async () => {
      await repository.addTagToTask('task-1', 'tag-1');
      await repository.addTagToTask('task-2', 'tag-1');
      await repository.addTagToTask('task-3', 'tag-2');

      const taskIds = await repository.findTaskIdsByTagId('tag-1');

      expect(taskIds).toContain('task-1');
      expect(taskIds).toContain('task-2');
      expect(taskIds).not.toContain('task-3');
    });
  });
});

describe('TagApplicationService', () => {
  let service;
  let tagRepository;
  let mockTaskRepository;

  beforeEach(() => {
    tagRepository = new TagRepositoryImpl();
    mockTaskRepository = {
      findById: jest.fn().mockResolvedValue({ id: 'mock-task' }),
    };
    service = new TagApplicationService({
      tagRepository,
      taskRepository: mockTaskRepository,
    });
  });

  afterEach(() => {
    tagRepository.clear();
  });

  describe('createTag', () => {
    it('应创建新标签', async () => {
      const tag = await service.createTag({
        userId: 'user-1',
        name: '工作',
        color: '#FF0000',
      });

      expect(tag.id).toBeTruthy();
      expect(tag.name).toBe('工作');
      expect(tag.color).toBe('#FF0000');
    });

    it('空userId应抛出异常', async () => {
      await expect(service.createTag({
        userId: '',
        name: '工作',
      })).rejects.toThrow('userId 不能为空');
    });

    it('空名称应抛出异常', async () => {
      await expect(service.createTag({
        userId: 'user-1',
        name: '',
      })).rejects.toThrow('标签名称不能为空');
    });

    it('重复名称应抛出异常', async () => {
      await service.createTag({ userId: 'user-1', name: '工作' });

      await expect(service.createTag({
        userId: 'user-1',
        name: '工作',
      })).rejects.toThrow('标签名称已存在');
    });
  });

  describe('getTagsByUserId', () => {
    it('应返回用户的所有标签', async () => {
      await service.createTag({ userId: 'user-1', name: '标签1' });
      await service.createTag({ userId: 'user-1', name: '标签2' });
      await service.createTag({ userId: 'user-2', name: '标签3' });

      const tags = await service.getTagsByUserId('user-1');

      expect(tags).toHaveLength(2);
    });
  });

  describe('addTagToTask', () => {
    it('应为任务添加标签', async () => {
      const tag = await service.createTag({ userId: 'user-1', name: '重要' });
      mockTaskRepository.findById.mockResolvedValue({ id: 'task-1' });

      const result = await service.addTagToTask('task-1', tag.id);

      expect(result.taskId).toBe('task-1');
      expect(result.tagId).toBe(tag.id);
    });

    it('任务不存在应抛出异常', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(service.addTagToTask('non-existent', 'tag-1'))
        .rejects.toThrow('任务不存在');
    });

    it('标签不存在应抛出异常', async () => {
      mockTaskRepository.findById.mockResolvedValue({ id: 'task-1' });

      await expect(service.addTagToTask('task-1', 'non-existent'))
        .rejects.toThrow('标签不存在');
    });
  });

  describe('getTaskIdsByTag', () => {
    it('应返回关联了标签的任务ID列表', async () => {
      const tag = await service.createTag({ userId: 'user-1', name: '测试' });
      await service.addTagToTask('task-1', tag.id);
      await service.addTagToTask('task-2', tag.id);

      const taskIds = await service.getTaskIdsByTag(tag.id);

      expect(taskIds).toContain('task-1');
      expect(taskIds).toContain('task-2');
    });
  });

  describe('getTagsWithTaskCount', () => {
    it('应返回标签及其任务数量', async () => {
      const tag1 = await service.createTag({ userId: 'user-1', name: '重要' });
      const tag2 = await service.createTag({ userId: 'user-1', name: '工作' });
      await service.addTagToTask('task-1', tag1.id);
      await service.addTagToTask('task-2', tag1.id);
      await service.addTagToTask('task-3', tag2.id);

      const result = await service.getTagsWithTaskCount('user-1');

      expect(result).toHaveLength(2);
      const important = result.find(r => r.tag.name === '重要');
      const work = result.find(r => r.tag.name === '工作');
      expect(important.taskCount).toBe(2);
      expect(work.taskCount).toBe(1);
    });
  });
});
